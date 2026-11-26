const Company = require("../models/Company");

async function canManageJob(job, user, { applicants = false } = {}) {
  if (user.role === "admin") return true;
  if (!job || user.role !== "employer") return false;
  const company = { owner: user._id };
  if (applicants) company.status = "Verified";
  if (job.company) {
    company._id = job.company;
  } else {
    // Older listings may only record their author.
    if (String(job.postedBy) !== String(user._id)) return false;
    if (!applicants) return true;
  }
  return Boolean(await Company.exists(company));
}

module.exports = { canManageJob };
