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
    // The browser accesses Express through the same-origin Next.js API proxy.
    // A site-wide cookie path is required for /api/cvs, /api/jobs and other endpoints.
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * @desc    Register a new user (Student or Employer)
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body || {};

    res.set("Cache-Control", "no-store");
    // 1. Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide fullName, email, and password.",
      });
    }

    if (typeof password !== "string" || password.length < 10 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 10 and 128 characters.",
      });
    }

    // 2. Normalize inputs
    const trimmedName = String(fullName).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    const requestedRole = role ? String(role).trim().toLowerCase() : "student";

    if (trimmedName.length < 2 || trimmedName.length > 100 ||
        normalizedEmail.length > 254 ||
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid full name (2–100 characters) and email address.",
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
    const token = generateToken({ id: user._id.toString(), role: user.role, version: user.sessionVersion ?? 0 });
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
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
    const { email, password } = req.body || {};

    res.set("Cache-Control", "no-store");
    // 1. Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (typeof email !== "string" || typeof password !== "string" ||
        normalizedEmail.length > 254 || password.length > 128) {
      return res.status(400).json({ success: false, message: "Invalid login details." });
    }

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
    const token = generateToken({ id: user._id.toString(), role: user.role, version: user.sessionVersion ?? 0 });
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
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
 * @desc    Update signed-in profile (safe editable fields only)
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateMe = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Authentication required." });

    const { fullName, phone, location, education, bio, skills } = req.body || {};
    const boundedText = (value, max) => typeof value === "string" && value.trim().length <= max;
    if (
      (fullName !== undefined && (!boundedText(fullName, 100) || fullName.trim().length < 2)) ||
      (phone !== undefined && !boundedText(phone, 40)) ||
      (location !== undefined && !boundedText(location, 120)) ||
      (education !== undefined && !boundedText(education, 200)) ||
      (bio !== undefined && !boundedText(bio, 1200)) ||
      (skills !== undefined && (!Array.isArray(skills) || skills.length > 30 ||
        !skills.every((skill) => typeof skill === "string" && skill.trim().length > 0 && skill.trim().length <= 60)))
    ) {
      return res.status(400).json({ success: false, message: "Invalid profile details or field length." });
    }
    for (const key of ["fullName", "phone", "location", "education", "bio"]) {
      if (req.body?.[key] !== undefined) user[key] = req.body[key].trim();
    }
    if (skills !== undefined) user.skills = [...new Set(skills.map((skill) => skill.trim()))];
    await user.save();
    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id, fullName: user.fullName, email: user.email, role: user.role,
        phone: user.phone, location: user.location, education: user.education,
        bio: user.bio, skills: user.skills, company: user.company, status: user.status,
      },
    });
  } catch (error) { next(error); }
};

/**
 * @desc    Change signed-in password and revoke other sessions
 * @route   POST /api/auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (typeof currentPassword !== "string" || typeof newPassword !== "string" ||
        newPassword.length < 10 || newPassword.length > 128 || currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: "Use a new password between 10 and 128 characters." });
    }
    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }
    user.password = newPassword;
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    await user.save();
    const token = generateToken({ id: user._id.toString(), role: user.role, version: user.sessionVersion });
    setTokenCookie(res, token);
    return res.json({ success: true, message: "Password updated. Other sessions have been signed out." });
  } catch (error) { next(error); }
};

/**
 * @desc    Request password reset instructions
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  // There is no configured email delivery in this build. Never pretend a
  // reset email was sent, and never disclose whether an account exists.
  return res.status(503).json({
    success: false,
    message: "Email password recovery is not configured. Sign in to change your password from Settings or contact the platform administrator.",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
};
