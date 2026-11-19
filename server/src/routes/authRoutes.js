const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requestPasswordReset, resetPassword } = require("../controllers/passwordResetController");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/change-password", protect, changePassword);

module.exports = router;
