const test = require("node:test");
const assert = require("node:assert/strict");
const { registerUser, loginUser } = require("./authController");
const { createCompany } = require("./companyController");
const { createJob } = require("./jobController");
const { createApplication, updateApplicationStatus } = require("./applicationController");

function response() {
  return {
    statusCode: 200,
    payload: null,
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
