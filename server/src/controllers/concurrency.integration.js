const assert = require("node:assert/strict");
const test = require("node:test");
const mongoose = require("mongoose");
const User = require("../models/User");
const Company = require("../models/Company");
const Cv = require("../models/Cv");
const Job = require("../models/Job");
const Application = require("../models/Application");
const cv = require("./cvController");
const { createApplication } = require("./applicationController");
const { createCompany } = require("./companyController");

async function invoke(handler, user, body) {
  const response = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(result) { this.data = result.data; return this; },
  };
  await handler({ user, body }, response, error => {
    if (!error.status) throw error;
    response.statusCode = error.status;
  });
  return response;
}

test("concurrent CV saves, registrations and applications stay consistent", async t => {
  // Each run uses a new database on the disposable local CI replica set.
  const dbName = "internlink_test_" + new mongoose.Types.ObjectId();
  await mongoose.connect("mongodb://127.0.0.1:27017/?replicaSet=rs0", { dbName, serverSelectionTimeoutMS: 5000 });
  t.after(async () => {
    try { await mongoose.connection.dropDatabase(); } finally { await mongoose.disconnect(); }
  });
  await Promise.all([User, Company, Cv, Job, Application].map(model => model.init()));
  const [student, employer] = await User.create([
    { fullName: "Test Student", email: "student@example.test", role: "student", password: "example-pass-123" },
    { fullName: "Test Employer", email: "employer@example.test", role: "employer", password: "example-pass-123" },
  ]);
  const registrations = await Promise.all(["One", "Two"].map(name => invoke(createCompany, employer,
    { name, email: "company@example.test", industry: "Technology" })));
  assert.deepEqual(registrations.map(r => r.statusCode).sort(), [201, 409]);
  const company = await Company.findOneAndUpdate({ owner: employer._id }, { status: "Verified" }, { new: true });
  assert.equal(String((await User.findById(employer._id)).company), String(company._id));

  const versions = await Promise.all(["A", "B"].map(name => invoke(cv.create, student,
    { name, isPrimary: true, summary: "Summary " + name })));
  assert.deepEqual(versions.map(r => r.statusCode), [201, 201]);
  const primary = await Cv.find({ student: student._id, isPrimary: true });
  assert.equal(primary.length, 1);
  assert.equal((await User.findById(student._id)).bio, primary[0].summary);
  await Cv.insertMany(Array.from({ length: 7 }, (_, i) => ({ student: student._id, name: "CV " + i })));
  const last = await Promise.all(["Ten", "Eleven"].map(name => invoke(cv.create, student, { name })));
  assert.deepEqual(last.map(r => r.statusCode).sort(), [201, 400]);
  assert.equal(await Cv.countDocuments({ student: student._id }), 10);

  const job = await Job.create({ title: "Intern", company: company._id, companyName: company.name,
    postedBy: employer._id, description: "Demo internship", location: "Colombo" });
  const submissions = await Promise.all([1, 2].map(() =>
    invoke(createApplication, student, { jobId: job.id, cvId: primary[0].id })));
  assert.deepEqual(submissions.map(r => r.statusCode).sort(), [201, 409]);
  assert.equal(await Application.countDocuments({ job: job._id }), 1);
  assert.equal((await Job.findById(job._id)).applicationsCount, 1);
});
