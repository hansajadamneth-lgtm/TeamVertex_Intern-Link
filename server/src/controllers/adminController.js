const User = require("../models/User");
const Job = require("../models/Job");
const Company = require("../models/Company");
const Application = require("../models/Application");

/**
 * @desc    Get aggregated platform statistics for Admin Dashboard
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalEmployers,
      totalCompanies,
      verifiedCompanies,
      pendingCompanies,
      suspendedCompanies,
      totalJobs,
      activeJobs,
      pendingJobs,
      closedJobs,
      totalApplications,
      recentJobs,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "employer" }),
      Company.countDocuments(),
      Company.countDocuments({ status: "Verified" }),
      Company.countDocuments({ status: "Pending" }),
      Company.countDocuments({ status: "Suspended" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "Active" }),
      Job.countDocuments({ status: "Pending" }),
      Job.countDocuments({ status: "Closed" }),
      Application.countDocuments(),
      Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title companyName status createdAt"),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName email role status createdAt"),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalStudents,
          totalEmployers,
          totalCompanies,
          verifiedCompanies,
          pendingCompanies,
          suspendedCompanies,
          totalJobs,
          activeJobs,
          pendingJobs,
          closedJobs,
          totalApplications,
        },
        recentJobs,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get paginated student accounts for Admin Student Management
 * @route   GET /api/admin/students
 * @access  Private (Admin only)
 */
const getStudents = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const query = { role: "student" };

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      const meta = new Set(["\\", ".", "*", "+", "?", "^", "$", "{", "}", "(", ")", "|", "[", "]"]);
      const safeSearch = [...String(search).trim().slice(0, 80)]
        .map(character => meta.has(character) ? "\\" + character : character).join("");
      const regex = { $regex: safeSearch, $options: "i" };
      query.$or = [
        { fullName: regex },
        { email: regex },
        { education: regex },
        { location: regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .select("fullName email education phone location status skills createdAt");

    return res.status(200).json({
      success: true,
      count: students.length,
      total,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
      },
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a student's account status (Active, Inactive, Pending)
 * @route   PATCH /api/admin/students/:id/status
 * @access  Private (Admin only)
 */
const updateStudentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Active", "Inactive", "Pending"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid student status. Permitted values: ${allowedStatuses.join(", ")}`,
      });
    }

    const student = await User.findOne({ _id: req.params.id, role: "student" });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student account not found with identifier: ${req.params.id}`,
      });
    }

    student.status = status;
    await student.save();

    return res.status(200).json({
      success: true,
      message: `Student account status updated to '${status}'.`,
      data: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
        status: student.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregated platform recruitment analytics and reporting distributions
 * @route   GET /api/admin/reports
 * @access  Private (Admin only)
 */
const getReports = async (req, res, next) => {
  try {
    const [
      activeJobsCount,
      pendingJobsCount,
      closedJobsCount,
      itJobsCount,
      marketingJobsCount,
      financeJobsCount,
      engineeringJobsCount,
      sentAppsCount,
      underReviewAppsCount,
      interviewAppsCount,
      acceptedAppsCount,
      rejectedAppsCount,
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
    ] = await Promise.all([
      Job.countDocuments({ status: "Active" }),
      Job.countDocuments({ status: "Pending" }),
      Job.countDocuments({ status: "Closed" }),
      Job.countDocuments({ category: "IT" }),
      Job.countDocuments({ category: "Marketing" }),
      Job.countDocuments({ category: "Finance" }),
      Job.countDocuments({ category: "Engineering" }),
      Application.countDocuments({ status: "Application sent" }),
      Application.countDocuments({ status: "Under review" }),
      Application.countDocuments({ status: "Interview scheduled" }),
      Application.countDocuments({ status: "Accepted" }),
      Application.countDocuments({ status: "Rejected" }),
      User.countDocuments({ role: "student" }),
      Company.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalApplications,
          totalCompanies,
          totalInternships: totalJobs,
          totalStudents,
        },
        jobsByStatus: {
          Active: activeJobsCount,
          Pending: pendingJobsCount,
          Closed: closedJobsCount,
        },
        jobsByCategory: {
          IT: itJobsCount,
          Marketing: marketingJobsCount,
          Finance: financeJobsCount,
          Engineering: engineeringJobsCount,
        },
        applicationsByStatus: {
          "Application sent": sentAppsCount,
          "Under review": underReviewAppsCount,
          "Interview scheduled": interviewAppsCount,
          Accepted: acceptedAppsCount,
          Rejected: rejectedAppsCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Real administrative listings: never use public catalog filters for oversight.
 */
const getAdminCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find()
      .sort({ createdAt: -1 }).limit(100)
      .select("name industry email website location status createdAt")
      .lean();
    return res.json({ success: true, count: companies.length, data: companies });
  } catch (error) { next(error); }
};

const getAdminJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 }).limit(100)
      .select("title companyName location category type status applicationsCount createdAt company postedBy")
      .lean();
    return res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) { next(error); }
};

module.exports = {
  getAdminCompanies,
  getAdminJobs,
  getAdminStats,
  getStudents,
  updateStudentStatus,
  getReports,
};
