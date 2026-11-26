const bcrypt = require("bcryptjs");

// bcrypt hashes only the first 72 UTF-8 bytes. Reject longer new passwords
// rather than silently treating different passwords as identical.
const validNewPassword = (value) =>
  typeof value === "string" && value.length >= 10 && Buffer.byteLength(value, "utf8") <= 72;

module.exports = { bcrypt, validNewPassword };
