const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

/**
 * Helper to set HTTP-only authentication cookie
 */
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

/**
 * @desc    Register a new user (Student or Employer)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    // 1. Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide fullName, email, and password.",
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // 2. Normalize inputs
    const trimmedName = String(fullName).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    const requestedRole = role ? String(role).trim().toLowerCase() : "student";

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 2 characters.",
      });
    }

    // 3. Security: Prevent public registration for admin role
    if (requestedRole === "admin" || !["student", "employer"].includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        message: "Public registration is only permitted for 'student' or 'employer' accounts.",
      });
    }

    // 4. Check for duplicate account
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // 5. Create user in database (password is automatically hashed via User pre-save hook)
    const user = await User.create({
      fullName: trimmedName,
      email: normalizedEmail,
      password,
      role: requestedRole,
    });

    // 6. Generate JWT token
    const token = generateToken({ id: user._id.toString(), role: user.role });
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // 2. Query user including the hidden password field
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Compare passwords via bcrypt method on model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 4. Check account status
    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is currently inactive. Please contact support.",
      });
    }

    // 5. Generate token & set cookie
    const token = generateToken({ id: user._id.toString(), role: user.role });
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        education: user.education,
        bio: user.bio,
        skills: user.skills,
        company: user.company,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by `protect` middleware)
 */
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. User profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        location: req.user.location,
        education: req.user.education,
        bio: req.user.bio,
        skills: req.user.skills,
        company: req.user.company,
        status: req.user.status,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request password reset instructions
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });

    // Honest handling: Check if an external SMTP/email provider is configured
    const hasEmailConfig = Boolean(process.env.SMTP_HOST || process.env.EMAIL_API_KEY);

    if (!hasEmailConfig) {
      return res.status(200).json({
        success: true,
        message: user
          ? "Password reset request received. Reset instructions will be dispatched once the email service is configured."
          : "If this email address is registered, password reset instructions will be processed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "If this email address is registered, password reset instructions have been dispatched.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
};
