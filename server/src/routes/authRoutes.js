const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  forgotPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

// Protected routes
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

module.exports = router;
