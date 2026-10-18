const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to authenticate requests using JWT Bearer token or cookie.
 * Attaches the authenticated database user to `req.user`.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check Authorization header for "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2. Fall back to cookie if cookie-parser is enabled
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Reject if no token is found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No authentication token provided.",
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error: JWT_SECRET is not configured.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, secret);

    // Fetch user from database excluding password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. User no longer exists.",
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is currently inactive. Please contact support.",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid authentication token.",
    });
  }
};

module.exports = {
  protect,
};
