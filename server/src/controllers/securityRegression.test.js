const test = require("node:test");
const assert = require("node:assert/strict");
const { registerUser, loginUser } = require("./authController");
const { createCompany } = require("./companyController");
const { createJob } = require("./jobController");
const Job = require("../models/Job");
const Company = require("../models/Company");
const Cv = require("../models/Cv");
const Application = require("../models/Application");
const { createApplication, updateApplicationStatus, getApplicationsForJob } = require("./applicationController");

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
test("job posting without a JSON body gives 400", async () => {
  await expectRejected(createJob, { user: { _id: "507f191e810c19729de860ea", role: "employer" } });
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
  const jobId = "507f191e810c19729de861";
  const studentId = "507f191e810c19729de862";
  const companyId = "507f191e810c19729de863";
  const cvId = "507f191e810c19729de864";
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
    Application.create = async data => { created = data; return { _id: "507f191e810c19729de865", ...data }; };
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
