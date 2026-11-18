const test = require("node:test");
const assert = require("node:assert/strict");
const { registerUser, loginUser } = require("./authController");
const { createCompany, updateCompany } = require("./companyController");
const { createJob, updateJob } = require("./jobController");
const Job = require("../models/Job");
const Company = require("../models/Company");
const Cv = require("../models/Cv");
const Application = require("../models/Application");
const { createApplication, updateApplicationStatus, getApplicationsForJob } = require("./applicationController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

function response() {
  return {
    statusCode: 200,
    payload: null,
    headers: {},
    set(name, value) { this.headers[name] = value; return this; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.payload = body; return this; },
  };
}
async function expectRejected(handler, request, expected = 400) {
  const res = response();
  let uncaught;
  await handler(request, res, error => { uncaught = error; });
  assert.equal(uncaught, undefined, "Invalid input should not throw");
  assert.equal(res.statusCode, expected);
  assert.equal(res.payload.success, false);
}

test("anonymous requests cannot pass authentication middleware", async () => {
  const res = response();
  let passed = false;
  await protect({ headers: {}, cookies: {} }, res, () => { passed = true; });
  assert.equal(passed, false);
  assert.equal(res.statusCode, 401);
});

test("student accounts cannot pass admin role middleware", () => {
  const res = response();
  let passed = false;
  authorize("admin")({ user: { role: "student" } }, res, () => { passed = true; });
  assert.equal(passed, false);
  assert.equal(res.statusCode, 403);
});

test("employer accounts cannot pass student role middleware", () => {
  const res = response();
  let passed = false;
  authorize("student")({ user: { role: "employer" } }, res, () => { passed = true; });
  assert.equal(passed, false);
  assert.equal(res.statusCode, 403);
});

test("admin accounts pass admin role middleware", () => {
  const res = response();
  let passed = false;
  authorize("admin")({ user: { role: "admin" } }, res, () => { passed = true; });
  assert.equal(passed, true);
});

test("registration without a JSON body gives 400, not 500", async () => {
  await expectRejected(registerUser, {});
});
test("login without a JSON body gives 400, not 500", async () => {
  await expectRejected(loginUser, {});
});
test("registration requires a 10-character password", async () => {
  await expectRejected(registerUser, {
    body: { fullName: "Demo Student", email: "demo@example.com", password: "short", role: "student" },
  });
});
test("company registration rejects a non-string name", async () => {
  await expectRejected(createCompany, {
    body: { name: { $gt: "" }, industry: "Technology", email: "company@example.com" },
    user: { _id: "507f191e810c19729de860ea", role: "employer" },
  });
});
test("verified company identity changes require administrator re-verification", async () => {
  const originalFindById = Company.findById;
  let saved;
  try {
    Company.findById = async () => ({
      _id: "507f191e810c19729de86063",
      owner: { toString: () => "507f191e810c19729de86062" },
      name: "Demo Technology",
      email: "contact@example.com",
      website: "https://example.com",
      status: "Verified",
      async save() { saved = { status: this.status, website: this.website }; },
    });
    const res = response();
    let unexpected;
    await updateCompany({
      params: { id: "507f191e810c19729de86063" },
      user: { _id: "507f191e810c19729de86062", role: "employer" },
      body: { website: "https://new.example.com" },
    }, res, error => { unexpected = error; });
    assert.equal(unexpected, undefined);
    assert.equal(res.statusCode, 200);
    assert.equal(saved.status, "Pending");
    assert.equal(saved.website, "https://new.example.com");
  } finally {
    Company.findById = originalFindById;
  }
});

test("job posting without a JSON body gives 400", async () => {
  await expectRejected(createJob, { user: { _id: "507f191e810c19729de860ea", role: "employer" } });
});
test("job posting rejects non-string title and invalid deadline types before database access", async () => {
  const user = { _id: "507f191e810c19729de860ea", role: "employer" };
  await expectRejected(createJob, {
    user,
    body: { title: { $gt: "" }, location: "Colombo", description: "Internship" },
  });
  await expectRejected(createJob, {
    user,
    body: { title: "Software Intern", location: "Colombo", description: "Internship", deadline: {} },
  });
});

test("job posting rejects excessive lengths and oversized skill lists", async () => {
  const user = { _id: "507f191e810c19729de860ea", role: "employer" };
  const valid = { title: "Software Intern", location: "Colombo", description: "Training internship" };
  await expectRejected(createJob, { user, body: { ...valid, description: "x".repeat(10001) } });
  await expectRejected(createJob, { user, body: { ...valid, location: "x".repeat(121) } });
  await expectRejected(createJob, { user, body: { ...valid, skills: Array.from({ length: 31 }, (_, i) => "Skill " + i) } });
  await expectRejected(createJob, { user, body: { ...valid, category: "invalid" } });
});

test("job posting with past deadline gives 400 before writing", async () => {
  await expectRejected(createJob, {
    body: {
      title: "Demo Developer Intern", location: "Colombo", description: "Internship",
      deadline: "2000-01-01",
    },
    user: { _id: "507f191e810c19729de860ea", role: "employer" },
  });
});
test("closed internships cannot be reopened by an employer edit", async () => {
  const originalFindById = Job.findById;
  try {
    Job.findById = async () => ({
      _id: "507f191e810c19729de86061",
      postedBy: { toString: () => "507f191e810c19729de86062" },
      status: "Closed",
    });
    await expectRejected(updateJob, {
      params: { id: "507f191e810c19729de86061" },
      user: { _id: "507f191e810c19729de86062", role: "employer" },
      body: { status: "Active" },
    }, 409);
  } finally {
    Job.findById = originalFindById;
  }
});

test("application without a job ID gives 400", async () => {
  await expectRejected(createApplication, { body: {}, user: { _id: "507f191e810c19729de860ea" } });
});
test("application with invalid job ID gives 400 instead of database cast error", async () => {
  await expectRejected(createApplication, { body: { jobId: "not-an-id" }, user: { _id: "507f191e810c19729de860ea" } });
});
test("application rejects unsafe CV links before writing", async () => {
  await expectRejected(createApplication, {
    body: { jobId: "507f191e810c19729de860ea", resumeUrl: "javascript:alert(1)" },
    user: { _id: "507f191e810c19729de860ea" },
  });
});
test("application status endpoint rejects missing body", async () => {
  await expectRejected(updateApplicationStatus, { params: { id: "507f191e810c19729de860ea" } });
});

test("application rejects invalid CV ID without touching MongoDB", async () => {
  await expectRejected(createApplication, {
    body: { jobId: "507f191e810c19729de860ea", cvId: "not-a-cv-id" },
    user: { _id: "507f191e810c19729de860ea" },
  });
});
test("applicant listing rejects malformed job IDs", async () => {
  await expectRejected(getApplicationsForJob, {
    params: { jobId: "incorrect" },
    user: { _id: "507f191e810c19729de860ea", role: "employer" },
  });
});
test("application status rejects malformed application IDs", async () => {
  await expectRejected(updateApplicationStatus, {
    params: { id: "incorrect" }, body: { status: "Accepted" },
    user: { _id: "507f191e810c19729de860ea", role: "employer" },
  });
});

test("student application uses only an owned CV, snapshots it and increments the job counter", async () => {
  const original = {
    job: Job.findById, company: Company.findOne, cv: Cv.findOne,
    existing: Application.findOne, create: Application.create, count: Job.findByIdAndUpdate,
  };
  const jobId = "507f191e810c19729de86061";
  const studentId = "507f191e810c19729de86062";
  const companyId = "507f191e810c19729de86063";
  const cvId = "507f191e810c19729de86064";
  let created = null, increment = null;
  try {
    Job.findById = async () => ({
      _id: jobId, company: companyId, companyName: "Demo Company",
      title: "Demo Internship", status: "Active", skills: ["React"], deadline: null,
    });
    Company.findOne = async () => ({ _id: companyId, status: "Verified" });
    Cv.findOne = async query => {
      assert.equal(String(query._id), cvId);
      assert.equal(String(query.student), studentId);
      return { _id: cvId, name: "Demo CV", headline: "Frontend Student",
        skills: ["React"], education: [], experience: [], projects: [] };
    };
    Application.findOne = async () => null;
    Application.create = async data => { created = data; return { _id: "507f191e810c19729de86065", ...data }; };
    Job.findByIdAndUpdate = async (id, change) => { increment = { id, change }; return {}; };
    const res = response();
    let unexpected;
    await createApplication({
      body: { jobId, cvId, coverLetter: "I would like to apply" },
      user: { _id: studentId, skills: ["React"], role: "student" },
    }, res, error => { unexpected = error; });
    assert.equal(unexpected, undefined);
    assert.equal(res.statusCode, 201);
    assert.equal(created.cv, cvId);
    assert.equal(created.cvSnapshot.name, "Demo CV");
    assert.deepEqual(created.cvSnapshot.skills, ["React"]);
    assert.equal(created.coverLetter, "I would like to apply");
    assert.equal(created.student, studentId);
    assert.equal(increment.id, jobId);
    assert.equal(increment.change.$inc.applicationsCount, 1);
  } finally {
    Job.findById = original.job;
    Company.findOne = original.company;
    Cv.findOne = original.cv;
    Application.findOne = original.existing;
    Application.create = original.create;
    Job.findByIdAndUpdate = original.count;
  }
});
