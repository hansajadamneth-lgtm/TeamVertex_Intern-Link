/**
 * Role-based authorization middleware.
 * Verifies that the authenticated database user (`req.user`) has one of the allowed roles.
 * Never trusts client-supplied headers or body parameters for role checks.
 *
 * @param  {...string} roles - Permitted user roles (e.g. 'student', 'employer', 'admin')
 * @returns {Function} Express middleware handler
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to access this resource.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not permitted to perform this action.`,
      });
    }

    next();
  };
};

module.exports = {
  authorize,
  isStudent: authorize("student"),
  isEmployer: authorize("employer"),
  isAdmin: authorize("admin"),
};
