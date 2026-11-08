const Job = require("../models/Job");

/**
 * @desc    Get all active internship postings (with search, filtering, and pagination)
 * @route   GET /api/jobs
 * @access  Public
 */
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      keyword,
      category,
      location,
      type,
      status,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Only verified admins can query non-active or all statuses.
    if (status && status !== "Active") {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access is required to view non-active internship posts.",
        });
      }
      if (!["all", "Pending", "Closed"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status filter." });
      }
    }
    query.status = !status || status === "Active" ? "Active" : status === "all" ? undefined : status;
    if (query.status === undefined) delete query.status;

    // 2. Category Filter
    if (category && category !== "All") {
      query.category = category;
    }

    // 3. Internship Type Filter (Full Time, Part Time, Remote, Hybrid)
    if (type && type !== "All") {
      query.type = type;
    }

    // 4. Location Filter
    if (location) {
      query.location = { $regex: String(location).trim(), $options: "i" };
    }

    // 5. Keyword / Search Query across title, company, description, and skills
    const searchTerm = search || keyword;
    if (searchTerm) {
      const regex = { $regex: String(searchTerm).trim(), $options: "i" };
      query.$or = [
        { title: regex },
        { companyName: regex },
        { description: regex },
        { requirements: regex },
        { skills: regex },
        { location: regex },
      ];
    }

    // 6. Pagination & Sorting setup
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sort === "deadline") {
      sortOptions = { deadline: 1 };
    }

    // 7. Execute Query
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate("company", "name industry website location status")
      .populate("postedBy", "fullName email role");

    return res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single internship posting by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name industry website location status description")
      .populate("postedBy", "fullName email");

    // Only active posts are public. Admins and the post owner may inspect drafts.
    const canViewPrivatePost = req.user && (
      req.user.role === "admin" ||
      (job && job.postedBy && String(job.postedBy._id || job.postedBy) === String(req.user._id))
    );
    if (!job || (job.status !== "Active" && !canViewPrivatePost)) {
      return res.status(404).json({
        success: false,
        message: "Internship post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new internship post
 * @route   POST /api/jobs
 * @access  Private (Employer, Admin)
 */
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      jobTitle,
      companyName,
      company,
      category,
      location,
      type,
      duration,
      deadline,
      description,
      requirements,
      skills,
      salary,
      status,
    } = req.body;

    const resolvedTitle = (title || jobTitle || "").trim();
    const resolvedCompanyName = (companyName || "").trim();
    const resolvedLocation = (location || "").trim();
    const resolvedDescription = (description || "").trim();

    // 1. Validate required fields
    if (!resolvedTitle || !resolvedCompanyName || !resolvedLocation || !resolvedDescription) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, companyName, location, and description.",
      });
    }

    // 2. Parse skills array if provided as comma-separated string
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof skills === "string" && skills.trim()) {
      parsedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    // 3. Security: Derive postedBy strictly from authenticated req.user
    const newJobData = {
      title: resolvedTitle,
      companyName: resolvedCompanyName,
      company: company || (req.user && req.user.company) || null,
      category: category || "IT",
      location: resolvedLocation,
      type: type || "Full Time",
      duration: duration || "3 Months",
      deadline: deadline ? new Date(deadline) : null,
      description: resolvedDescription,
      requirements: requirements || "",
      skills: parsedSkills,
      salary: salary || "",
      status: status || "Active",
      postedBy: req.user._id,
    };

    const job = await Job.create(newJobData);

    return res.status(201).json({
      success: true,
      message: "Internship post created successfully!",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing internship post
 * @route   PUT /api/jobs/:id
 * @access  Private (Owner Employer or Admin)
 */
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Internship post not found with identifier: ${req.params.id}`,
      });
    }

    // Security: Check ownership (Employer owner or Admin)
    const isOwner =
      job.postedBy && job.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized. You can only update posts created by your account.",
      });
    }

    // Whitelist allowed update fields (ignore any attempts to overwrite postedBy)
    const allowedFields = [
      "title",
      "companyName",
      "category",
      "location",
      "type",
      "duration",
      "deadline",
      "description",
      "requirements",
      "skills",
      "salary",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Internship post updated successfully!",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete or close an internship post
 * @route   DELETE /api/jobs/:id
 * @access  Private (Owner Employer or Admin)
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Internship post not found with identifier: ${req.params.id}`,
      });
    }

    // Security: Check ownership (Employer owner or Admin)
    const isOwner =
      job.postedBy && job.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized. You can only delete or close posts created by your account.",
      });
    }

    // Support permanent deletion via query ?permanent=true, otherwise safe closure
    if (req.query.permanent === "true") {
      await job.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Internship post permanently removed.",
        data: { id: req.params.id },
      });
    }

    // Default safe closure
    job.status = "Closed";
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Internship post closed successfully.",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
