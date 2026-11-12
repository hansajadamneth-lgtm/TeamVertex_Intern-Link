const Job = require("../models/Job");
const Company = require("../models/Company");

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

    const verifiedCompanyIds = await Company.distinct("_id", { status: "Verified" });
    const query = { company: { $in: verifiedCompanyIds } };

    // Public catalog is restricted to active, unexpired verified-company listings.
    // Never honor client-supplied status=all on unauthenticated endpoints.
    query.status = "Active";
    // Use AND so a keyword search cannot bypass the expiry restriction.
    query.$and = [{ $or: [{ deadline: null }, { deadline: { $gte: new Date() } }] }];

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
      const meta = new Set(["\\", ".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]"]);
      const safeLocation = [...String(location).trim().slice(0, 80)]
        .map(character => meta.has(character) ? "\\" + character : character).join("");
      query.location = { $regex: safeLocation, $options: "i" };
    }

    // 5. Keyword / Search Query across title, company, description, and skills
    const searchTerm = search || keyword;
    if (searchTerm) {
      const meta = new Set(["\\", ".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]"]);
      const safeTerm = [...String(searchTerm).trim().slice(0, 80)]
        .map((character) => meta.has(character) ? "\\" + character : character)
        .join("");
      const regex = { $regex: safeTerm, $options: "i" };
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
      .populate("postedBy", "fullName role");

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
      .populate("postedBy", "fullName");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Internship post not found with identifier: ${req.params.id}`,
      });
    }

    if (job.status !== "Active" || (job.deadline && job.deadline < new Date()) || !job.company || job.company.status !== "Verified") {
      return res.status(404).json({ success: false, message: "Internship not available." });
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
    } = req.body || {};

    const resolvedTitle = (title || jobTitle || "").trim();
    const resolvedLocation = (location || "").trim();
    const resolvedDescription = (description || "").trim();

    // 1. Validate required fields
    if (!resolvedTitle || !resolvedLocation || !resolvedDescription) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, companyName, location, and description.",
      });
    }

    // Reject malformed or expired deadlines before writing a public listing.
    // A date-only deadline remains open through the end of the selected UTC day.
    const parsedDeadline = deadline
      ? (typeof deadline === "string" && /^\d{4}-\d{2}-\d{2}$/.test(deadline)
          ? new Date(deadline + "T23:59:59.999Z")
          : new Date(deadline))
      : null;
    if (parsedDeadline && (!Number.isFinite(parsedDeadline.getTime()) || parsedDeadline < new Date())) {
      return res.status(400).json({ success: false, message: "Provide a valid future internship deadline." });
    }

    // 2. Parse skills array if provided as comma-separated string
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof skills === "string" && skills.trim()) {
      parsedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    // Employers must have a verified company before publishing any internship.
    const ownedCompany = req.user.role === "admin"
      ? (company ? await Company.findById(company) : null)
      : await Company.findOne({ owner: req.user._id });
    if (!ownedCompany || ownedCompany.status !== "Verified") {
      return res.status(403).json({ success: false, message: "A verified employer company is required before posting." });
    }

    // 3. Security: Derive company name and postedBy from verified ownership
    const newJobData = {
      title: resolvedTitle,
      companyName: ownedCompany.name,
      company: ownedCompany._id,
      category: category || "IT",
      location: resolvedLocation,
      type: type || "Full Time",
      duration: duration || "3 Months",
      deadline: parsedDeadline,
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

    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) return res.status(400).json({ success: false, message: "Provide valid internship update fields." });

    // Whitelist allowed update fields (ignore any attempts to overwrite postedBy)
    const allowedFields = [
      "title",
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

    // Do not let edits reopen old listings or silently accept invalid dates.
    if (req.body?.deadline !== undefined) {
      const supplied = req.body.deadline;
      const parsed = supplied
        ? (typeof supplied === "string" && /^\d{4}-\d{2}-\d{2}$/.test(supplied)
            ? new Date(supplied + "T23:59:59.999Z")
            : new Date(supplied))
        : null;
      if (parsed && (!Number.isFinite(parsed.getTime()) || parsed < new Date())) {
        return res.status(400).json({ success: false, message: "Provide a valid future internship deadline." });
      }
      req.body.deadline = parsed;
    }
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
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

    // Always soft-close listings. Permanent deletion would orphan student
    // applications and destroy recruitment records needed for accountability.
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
