const express = require("express");
const {
  createApplication,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// Student routes
router.post("/", protect, authorize("student"), createApplication);
router.get("/me", protect, authorize("student"), getMyApplications);

// Employer / Admin routes
router.get("/job/:jobId", protect, authorize("employer", "admin"), getApplicationsForJob);
router.patch("/:id/status", protect, authorize("employer", "admin"), updateApplicationStatus);

module.exports = router;
