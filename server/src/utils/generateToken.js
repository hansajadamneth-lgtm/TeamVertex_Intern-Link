const jwt = require("jsonwebtoken");

/**
 * Generate a signed JSON Web Token for an authenticated user.
 *
 * @param {string|object} payload - User ID or payload containing id and role
 * @param {string} [expiresIn] - Optional custom expiration duration
 * @returns {string} Signed JWT token
 */
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || "7d") => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT configuration error: JWT_SECRET is not set in environment variables."
    );
  }

  // Support passing either a plain user ID string or an object with { id, role }
  const data = typeof payload === "string" ? { id: payload } : payload;

  return jwt.sign(data, secret, {
    expiresIn,
    algorithm: "HS256",
  });
};

/**
 * Verify and decode a JWT token.
 *
 * @param {string} token - The JWT string to verify
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT configuration error: JWT_SECRET is not set in environment variables."
    );
  }

  return jwt.verify(token, secret, { algorithms: ["HS256"] });
};

module.exports = {
  generateToken,
  verifyToken,
};
