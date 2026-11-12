const Company = require("../models/Company");
const User = require("../models/User");

/**
 * @desc    Get directory of companies (verified by default for public)
 * @route   GET /api/companies
 * @access  Public
 */
const getCompanies = async (req, res, next) => {
  try {
    const {
      search,
      keyword,
      industry,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Public directory must never expose pending or suspended company records,
    // regardless of user-controlled query parameters.
    query.status = "Verified";

    // 2. Industry Filter
    if (industry && industry !== "All") {
      query.industry = industry;
    }

    // 3. Search query across name, industry, location, description
    const searchTerm = search || keyword;
    if (searchTerm) {
      const meta = new Set(["\\", ".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]"]);
      const escaped = [...String(searchTerm).trim().slice(0, 80)]
        .map((character) => meta.has(character) ? "\\" + character : character).join("");
      const regex = { $regex: escaped, $options: "i" };
      query.$or = [
        { name: regex },
        { industry: regex },
        { location: regex },
        { description: regex },
      ];
    }

    // 4. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("owner", "fullName");

    return res.status(200).json({
      success: true,
      count: companies.length,
      total,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single company by ID
 * @route   GET /api/companies/:id
 * @access  Public
 */
const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "owner",
      "fullName"
    );

    if (!company || company.status !== "Verified") {
      return res.status(404).json({ success: false, message: "Verified company not found." });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new company profile
 * @route   POST /api/companies
 * @access  Private (Employers & Admin)
 */
const createCompany = async (req, res, next) => {
  try {
    const { name, industry, email, website, location, description } = req.body;

    // Reject non-string fields before calling trim() or Mongoose validators.
    // Invalid client input should return 400, never trigger an internal 500.
    if ([name, industry, email].some(value => typeof value !== "string") ||
        [website, location, description].some(value => value !== undefined && typeof value !== "string")) {
      return res.status(400).json({ success: false, message: "Company details must contain valid text fields." });
    }
    const trimmedName = name.trim();
    const trimmedIndustry = industry.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedWebsite = String(website || "").trim();
    const validWebsite = !trimmedWebsite || /^https?:\/\/[^\s]+$/i.test(trimmedWebsite);
    if (!validWebsite || trimmedWebsite.length > 400) {
      return res.status(400).json({ success: false, message: "Company website must be a valid http:// or https:// URL." });
    }

    // 1. Validate required fields
    if (!trimmedName || !trimmedIndustry || !trimmedEmail) {
      return res.status(400).json({
        success: false,
        message: "Please provide company name, industry, and contact email.",
      });
    }
    if (trimmedName.length < 2 || trimmedName.length > 150 ||
        trimmedIndustry.length > 100 || trimmedIndustry.length < 2 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 254 ||
        (location || "").length > 120 || (description || "").length > 2000) {
      return res.status(400).json({ success: false, message: "Invalid company name, industry, email or field length." });
    }

    // 2. Prevent employers from creating duplicate company profiles for their account
    if (req.user.role !== "admin") {
      const existingOwnerCompany = await Company.findOne({ owner: req.user._id });
      if (existingOwnerCompany) {
        return res.status(409).json({
          success: false,
          message: "Your employer account already has a registered company profile.",
          data: existingOwnerCompany,
        });
      }
    }

    // 3. Check for duplicate company name
    const existingName = await Company.findOne({
      name: trimmedName,
    }).collation({ locale: "en", strength: 2 });
    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "A company with this name is already registered.",
      });
    }

    // 4. Security: Company starts as 'Pending' verification. Owner is set from verified session.
    const company = await Company.create({
      name: trimmedName,
      industry: trimmedIndustry,
      email: trimmedEmail,
      website: trimmedWebsite,
      location: (location || "").trim(),
      description: (description || "").trim(),
      status: "Pending", // Must be verified by an admin
      owner: req.user._id,
    });

    // Link company to user profile
    await User.findByIdAndUpdate(req.user._id, { company: company._id });

    return res.status(201).json({
      success: true,
      message: "Company profile registered successfully and is pending admin verification.",
      data: company,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A company with this name is already registered.",
      });
    }
    next(error);
  }
};

/**
 * @desc    Update company status (Verify, Suspend)
 * @route   PATCH /api/companies/:id/status
 * @access  Private (Admin only)
 */
const updateCompanyStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Verified", "Pending", "Suspended"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Permitted values: ${allowedStatuses.join(", ")}`,
      });
    }

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: `Company not found with identifier: ${req.params.id}`,
      });
    }

    company.status = status;
    await company.save();

    return res.status(200).json({
      success: true,
      message: `Company status successfully updated to '${status}'.`,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update company details
 * @route   PUT /api/companies/:id
 * @access  Private (Company Owner Employer or Admin)
 */
const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: `Company not found with identifier: ${req.params.id}`,
      });
    }

    // Ownership check: must be company owner or platform admin
    const isOwner =
      company.owner && company.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized. You can only update your own company profile.",
      });
    }

    if (req.body.website !== undefined && (typeof req.body.website !== "string" ||
        (req.body.website.trim() && (!/^https?:\/\/[^\s]+$/i.test(req.body.website.trim()) || req.body.website.length > 400)))) {
      return res.status(400).json({ success: false, message: "Company website must be a valid http:// or https:// URL." });
    }

    const editableFields = ["name", "industry", "email", "website", "location", "description"];
    if (editableFields.some(field => req.body[field] !== undefined && typeof req.body[field] !== "string")) {
      return res.status(400).json({ success: false, message: "Company updates must contain valid text fields." });
    }
    if ((req.body.name !== undefined && (req.body.name.trim().length < 2 || req.body.name.trim().length > 150)) ||
        (req.body.industry !== undefined && (req.body.industry.trim().length < 2 || req.body.industry.trim().length > 100)) ||
        (req.body.email !== undefined && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email.trim()) || req.body.email.length > 254)) ||
        (req.body.location !== undefined && req.body.location.length > 120) ||
        (req.body.description !== undefined && req.body.description.length > 2000)) {
      return res.status(400).json({ success: false, message: "Invalid company update values or lengths." });
    }

    // Whitelist editable fields (prevent employers from self-verifying status or changing owner)
    const allowedFields = ["name", "industry", "email", "website", "location", "description"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company profile updated successfully!",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompanyStatus,
  updateCompany,
};
