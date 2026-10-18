const express = require("express");
const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompanyStatus,
  updateCompany,
} = require("../controllers/companyController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// Public routes
router.get("/", getCompanies);
router.get("/:id", getCompanyById);

// Employer & Admin routes
router.post("/", protect, authorize("employer", "admin"), createCompany);
router.put("/:id", protect, authorize("employer", "admin"), updateCompany);

// Admin-only verification & status workflow
router.patch("/:id/status", protect, authorize("admin"), updateCompanyStatus);

module.exports = router;
