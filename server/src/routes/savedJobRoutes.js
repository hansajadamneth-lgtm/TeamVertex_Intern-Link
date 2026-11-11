const router = require("express").Router();
const mongoose = require("mongoose");
const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");
const Company = require("../models/Company");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect, authorize("student"));

router.get("/", async (req, res, next) => {
  try {
    const saved = await SavedJob.find({ student: req.user._id })
      .sort({ createdAt: -1 }).limit(100)
      .populate("job", "title companyName location category type status deadline skills company createdAt").lean();
    const companyIds = [...new Set(saved.filter(x => x.job?.company).map(x => String(x.job.company)))];
    const companies = await Company.find({ _id: { $in: companyIds }, status: "Verified" }).select("_id").lean();
    const verified = new Set(companies.map(c => String(c._id)));
    const data = saved.filter(x => x.job && verified.has(String(x.job.company)) &&
      x.job.status === "Active" && (!x.job.deadline || new Date(x.job.deadline) >= new Date()));
    return res.json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const jobId = req.body?.jobId;
    if (!mongoose.isValidObjectId(jobId)) return res.status(400).json({ success: false, message: "Invalid internship ID." });
    const job = await Job.findById(jobId);
    if (!job || job.status !== "Active" || (job.deadline && job.deadline < new Date()))
      return res.status(404).json({ success: false, message: "Internship unavailable." });
    const company = job.company && await Company.findOne({ _id: job.company, status: "Verified" });
    if (!company) return res.status(404).json({ success: false, message: "Internship unavailable." });
    await SavedJob.updateOne({ student: req.user._id, job: job._id },
      { $setOnInsert: { student: req.user._id, job: job._id } }, { upsert: true });
    return res.json({ success: true, message: "Internship saved." });
  } catch (error) { next(error); }
});

router.delete("/:jobId", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.jobId)) return res.status(400).json({ success: false, message: "Invalid internship ID." });
    await SavedJob.deleteOne({ student: req.user._id, job: req.params.jobId });
    return res.json({ success: true, message: "Internship removed from saved jobs." });
  } catch (error) { next(error); }
});

module.exports = router;
