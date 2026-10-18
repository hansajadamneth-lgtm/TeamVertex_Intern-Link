const Application = require("../models/Application");
const Job = require("../models/Job");

/**
 * @desc    Submit a new internship application
 * @route   POST /api/applications
 * @access  Private (Students only)
 */
const createApplication = async (req, res, next) => {
  try {
    const { jobId, job: jobFromBody, resumeUrl, coverLetter, notes } = req.body;
    const targetJobId = jobId || jobFromBody;

    if (!targetJobId) {
      return res.status(400).json({
        success: false,
        message: "Please specify the internship job ID to apply for.",
      });
    }

    // 1. Verify that target job exists
    const job = await Job.findById(targetJobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Internship post not found with identifier: ${targetJobId}`,
      });
    }

    // 2. Verify job is active
    if (job.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Cannot submit application to an inactive or closed internship post.",
      });
    }

    // 3. Prevent duplicate applications
    const existingApp = await Application.findOne({
      student: req.user._id,
      job: job._id,
    });

    if (existingApp) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted an application for this internship.",
      });
    }

    // 4. Calculate sensible AI match fit score based on skills or sensible default
    let fitScore = 80;
    if (req.user.skills && req.user.skills.length > 0 && job.skills && job.skills.length > 0) {
      const studentSkills = req.user.skills.map((s) => s.toLowerCase().trim());
      const jobSkills = job.skills.map((s) => s.toLowerCase().trim());
      const matches = studentSkills.filter((s) => jobSkills.includes(s));
      const ratio = matches.length / jobSkills.length;
      fitScore = Math.min(98, Math.max(70, Math.round(70 + ratio * 28)));
    } else {
      fitScore = Math.floor(Math.random() * 15) + 80; // 80 - 94%
    }

    // 5. Create application record
    const application = await Application.create({
      student: req.user._id,
      job: job._id,
      company: job.company,
      companyName: job.companyName,
      position: job.title,
      status: "Application sent",
      fitScore,
      resumeUrl: resumeUrl || "",
      coverLetter: coverLetter || notes || "",
      action: "Download Copy",
    });

    // 6. Safely increment job applicationsCount atomically
    await Job.findByIdAndUpdate(job._id, { $inc: { applicationsCount: 1 } });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: application,
    });
  } catch (error) {
    // Graceful handling of MongoDB duplicate-key error (E11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted an application for this internship.",
      });
    }
    next(error);
  }
};

/**
 * @desc    Get current student's submitted applications
 * @route   GET /api/applications/me
 * @access  Private (Students only)
 */
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate("job", "title companyName category location type deadline status")
      .populate("company", "name industry website location")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications received for a specific job
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Job Owner Employer or Admin)
 */
const getApplicationsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Internship post not found with identifier: ${req.params.jobId}`,
      });
    }

    // Ownership check: must be job author or platform admin
    const isOwner =
      job.postedBy && job.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized. You can only view applications for posts you created.",
      });
    }

    const applications = await Application.find({ job: job._id })
      .populate("student", "fullName email phone education skills bio")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status (Review, Interview, Accept, Reject)
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Job Owner Employer or Admin)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Interview scheduled",
      "Under review",
      "Application sent",
      "Rejected",
      "Accepted",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid application status. Permitted values: ${allowedStatuses.join(", ")}`,
      });
    }

    const application = await Application.findById(req.params.id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Application not found with identifier: ${req.params.id}`,
      });
    }

    // Ownership check: Job creator or admin
    const job = application.job;
    const isOwner =
      job && job.postedBy && job.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized. You can only update applications for internship posts you manage.",
      });
    }

    // Update status and corresponding display action
    application.status = status;
    if (status === "Interview scheduled") {
      application.action = "View Invite";
    } else if (status === "Under review") {
      application.action = "Details Pending";
    } else {
      application.action = "Download Copy";
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Application status updated to '${status}'.`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};
