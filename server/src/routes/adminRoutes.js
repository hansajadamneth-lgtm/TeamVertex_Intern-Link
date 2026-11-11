const express = require("express");
const {
  getAdminStats,
  getStudents,
  updateStudentStatus,
  getReports,
  getAdminCompanies,
  getAdminJobs,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// Enforce authentication & admin-only authorization on all admin routes
router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/companies", getAdminCompanies);
router.get("/jobs", getAdminJobs);
router.get("/students", getStudents);
router.patch("/students/:id/status", updateStudentStatus);
router.get("/reports", getReports);

module.exports = router;
