const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Job = require("../models/Job");
const Cv = require("../models/Cv");
const Company = require("../models/Company");
const Application = require("../models/Application");
const { protect } = require("../middleware/authMiddleware");
const { update: updateCv, remove: removeCv } = require("./cvController");
const {
  createApplication,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("./applicationController");

const studentId = "507f191e810c19729de86062";
const ownerId = "507f191e810c19729de86063";
const strangerId = "507f191e810c19729de86064";
const companyId = "507f191e810c19729de86065";
const jobId = "507f191e810c19729de86066";
const cvId = "507f191e810c19729de86067";
const applicationId = "507f191e810c19729de86068";

function response() {
  return {
    statusCode: 200, payload: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
    set() { return this; },
  };
}
async function invoke(fn, req) {
  const res = response();
  let error;
  await fn(req, res, err => { error = err; });
  if (error) throw error;
  return res;
}

test("an employer cannot read applications for another employer's job", async () => {
  const old = Job.findById;
  const oldFind = Application.find;
  try {
    Job.findById = async () => ({ _id: jobId, postedBy: ownerId });
    Application.find = () => { throw new Error("Applications must not be queried"); };
    const res = await invoke(getApplicationsForJob, {
      params: { jobId }, user: { _id: strangerId, role: "employer" },
    });
    assert.equal(res.statusCode, 403);
    assert.equal(res.payload.success, false);
  } finally {
    Job.findById = old;
    Application.find = oldFind;
  }
});

test("an employer cannot update another employer's applicant", async () => {
  const old = Application.findById;
  let written = false;
  try {
    Application.findById = () => ({
      populate: async () => ({
        job: { postedBy: ownerId },
        status: "Application sent",
        save: async () => { written = true; },
      }),
    });
    const res = await invoke(updateApplicationStatus, {
      params: { id: applicationId }, body: { status: "Accepted" },
      user: { _id: strangerId, role: "employer" },
    });
    assert.equal(res.statusCode, 403);
    assert.equal(written, false);
  } finally {
    Application.findById = old;
  }
});

test("students cannot submit another student's CV", async () => {
  const oldJob = Job.findById;
  const oldCompany = Company.findOne;
  const oldCv = Cv.findOne;
  const oldApp = Application.create;
  let wrote = false;
  try {
    Job.findById = async () => ({
      _id: jobId, status: "Active", company: companyId, deadline: null,
    });
    Company.findOne = async () => ({ _id: companyId, status: "Verified" });
    Cv.findOne = async (query) => {
      assert.equal(String(query.student), studentId);
      assert.equal(String(query._id), cvId);
      return null;
    };
    Application.create = async () => { wrote = true; };
    const res = await invoke(createApplication, {
      body: { jobId, cvId }, user: { _id: studentId, role: "student" },
    });
    assert.equal(res.statusCode, 400);
    assert.equal(wrote, false);
  } finally {
    Job.findById = oldJob;
    Company.findOne = oldCompany;
    Cv.findOne = oldCv;
    Application.create = oldApp;
  }
});

test("CV edit/delete queries are scoped to the current student", async () => {
  const oldFind = Cv.findOne;
  const oldDelete = Cv.findOneAndDelete;
  try {
    Cv.findOne = async (query) => {
      assert.equal(String(query.student), studentId);
      assert.equal(String(query._id), cvId);
      return null;
    };
    Cv.findOneAndDelete = async (query) => {
      assert.equal(String(query.student), studentId);
      assert.equal(String(query._id), cvId);
      return null;
    };
    const req = { params: { id: cvId }, body: { name: "Hacked" }, user: { _id: studentId } };
    assert.equal((await invoke(updateCv, req)).statusCode, 404);
    assert.equal((await invoke(removeCv, req)).statusCode, 404);
  } finally {
    Cv.findOne = oldFind;
    Cv.findOneAndDelete = oldDelete;
  }
});

test("student application listing queries only the signed-in student's records", async () => {
  const old = Application.find;
  try {
    Application.find = query => {
      assert.equal(String(query.student), studentId);
      return {
        populate() { return this; },
        async sort() { return []; },
      };
    };
    const res = await invoke(getMyApplications, { user: { _id: studentId } });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.payload.data, []);
  } finally {
    Application.find = old;
  }
});

test("suspended users and invalidated sessions cannot authenticate", async () => {
  const oldSecret = process.env.JWT_SECRET;
  const oldFind = User.findById;
  try {
    process.env.JWT_SECRET = "test-only-secret-not-a-real-key";
    const token = jwt.sign({ id: studentId, version: 0 }, process.env.JWT_SECRET, {
      algorithm: "HS256", expiresIn: "15m",
    });
    for (const [status, sessionVersion, expected] of [
      ["Inactive", 0, 403],
      ["Active", 2, 401],
    ]) {
      User.findById = () => ({
        select: async () => ({ _id: studentId, role: "student", status, sessionVersion }),
      });
      const res = response();
      let nextCalled = false;
      await protect({ headers: { authorization: "Bearer " + token }, cookies: {} }, res, () => {
        nextCalled = true;
      });
      assert.equal(res.statusCode, expected);
      assert.equal(nextCalled, false);
    }
  } finally {
    User.findById = oldFind;
    if (oldSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = oldSecret;
  }
});
