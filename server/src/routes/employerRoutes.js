const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const Company = require("../models/Company");
const Job = require("../models/Job");

router.use(protect, authorize("employer"));
router.get("/overview", async (req, res, next) => {
  try {
    const company = await Company.findOne({ owner: req.user._id })
      .select("name industry email location website description status createdAt").lean();
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 })
      .select("title companyName location category type status applicationsCount createdAt deadline").limit(100).lean();
    return res.json({ success: true, data: { company, jobs } });
  } catch (error) { next(error); }
});
module.exports = router;
