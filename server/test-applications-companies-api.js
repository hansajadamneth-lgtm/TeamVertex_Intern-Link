const assert = require("assert");
const Application = require("./src/models/Application");
const Job = require("./src/models/Job");
const Company = require("./src/models/Company");
const User = require("./src/models/User");

const {
  createApplication,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("./src/controllers/applicationController");

const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompanyStatus,
  updateCompany,
} = require("./src/controllers/companyController");

const applicationRoutes = require("./src/routes/applicationRoutes");
const companyRoutes = require("./src/routes/companyRoutes");

console.log("Starting Phase 6 Applications & Company Management API Test Suite...\n");

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ FAIL: ${name}`);
      console.error(err);
      failed++;
    }
  }

  // --- SECTION A: APPLICATIONS API TESTS ---

  // 1. Missing job ID in application
  await test("createApplication rejects missing job ID with 400", async () => {
    const req = { user: { _id: "student_1", role: "student" }, body: {} };
    const res = createMockRes();

    await createApplication(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes("specify the internship job ID"));
  });

  // 2. Non-existent job
  await test("createApplication returns 404 if internship job does not exist", async () => {
    const origFindById = Job.findById;
    Job.findById = async () => null;

    try {
      const req = { user: { _id: "student_1", role: "student" }, body: { jobId: "missing_job" } };
      const res = createMockRes();

      await createApplication(req, res, () => {});

      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("not found"));
    } finally {
      Job.findById = origFindById;
    }
  });

  // 3. Inactive / Closed job application rejection
  await test("createApplication rejects application to inactive/closed job with 400", async () => {
    const origFindById = Job.findById;
    Job.findById = async () => ({
      _id: "closed_job_id",
      status: "Closed",
      title: "Closed Job",
    });

    try {
      const req = { user: { _id: "student_1", role: "student" }, body: { jobId: "closed_job_id" } };
      const res = createMockRes();

      await createApplication(req, res, () => {});

      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("inactive or closed"));
    } finally {
      Job.findById = origFindById;
    }
  });

  // 4. Duplicate application rejection
  await test("createApplication rejects duplicate application by same student with 409", async () => {
    const origJobFindById = Job.findById;
    const origAppFindOne = Application.findOne;

    Job.findById = async () => ({
      _id: "active_job_id",
      status: "Active",
      title: "Active Job",
    });
    Application.findOne = async () => ({ _id: "existing_app_id" });

    try {
      const req = { user: { _id: "student_1", role: "student" }, body: { jobId: "active_job_id" } };
      const res = createMockRes();

      await createApplication(req, res, () => {});

      assert.strictEqual(res.statusCode, 409);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("already submitted an application"));
    } finally {
      Job.findById = origJobFindById;
      Application.findOne = origAppFindOne;
    }
  });

  // 5. Successful application creation and atomic increment
  await test("createApplication creates application record and increments job applicationsCount", async () => {
    const origJobFindById = Job.findById;
    const origAppFindOne = Application.findOne;
    const origAppCreate = Application.create;
    const origJobUpdate = Job.findByIdAndUpdate;

    let incJobId = null;
    let incPayload = null;
    let createdPayload = null;

    Job.findById = async () => ({
      _id: "active_job_id",
      title: "Software Intern",
      company: "company_123",
      companyName: "TechNova",
      status: "Active",
      skills: ["React", "TypeScript", "Node.js"],
    });

    Application.findOne = async () => null;

    Application.create = async (data) => {
      createdPayload = data;
      return { _id: "new_app_1", ...data };
    };

    Job.findByIdAndUpdate = async (id, update) => {
      incJobId = id;
      incPayload = update;
      return {};
    };

    try {
      const req = {
        user: {
          _id: "student_1",
          role: "student",
          skills: ["React", "TypeScript"],
        },
        body: {
          jobId: "active_job_id",
          coverLetter: "Excited to apply!",
        },
      };
      const res = createMockRes();

      await createApplication(req, res, () => {});

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(createdPayload.student, "student_1");
      assert.strictEqual(createdPayload.job, "active_job_id");
      assert.strictEqual(createdPayload.status, "Application sent");
      assert.ok(createdPayload.fitScore >= 70);
      assert.strictEqual(incJobId, "active_job_id");
      assert.strictEqual(incPayload.$inc.applicationsCount, 1);
    } finally {
      Job.findById = origJobFindById;
      Application.findOne = origAppFindOne;
      Application.create = origAppCreate;
      Job.findByIdAndUpdate = origJobUpdate;
    }
  });

  // 6. getMyApplications returns student's applications
  await test("getMyApplications returns student applications list with 200", async () => {
    const origFind = Application.find;
    const mockApps = [{ _id: "app_1", position: "Frontend Intern" }];

    Application.find = (q) => {
      assert.strictEqual(q.student, "student_1");
      return {
        populate: () => ({
          populate: () => ({
            sort: async () => mockApps,
          }),
        }),
      };
    };

    try {
      const req = { user: { _id: "student_1", role: "student" } };
      const res = createMockRes();

      await getMyApplications(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.count, 1);
      assert.deepStrictEqual(res.body.data, mockApps);
    } finally {
      Application.find = origFind;
    }
  });

  // 7. getApplicationsForJob blocks non-owner employer (403)
  await test("getApplicationsForJob blocks unauthorized non-owner employer with 403", async () => {
    const origFindById = Job.findById;
    Job.findById = async () => ({
      _id: "job_1",
      postedBy: "different_employer_id",
    });

    try {
      const req = {
        params: { jobId: "job_1" },
        user: { _id: "wrong_employer_id", role: "employer" },
      };
      const res = createMockRes();

      await getApplicationsForJob(req, res, () => {});

      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.success, false);
    } finally {
      Job.findById = origFindById;
    }
  });

  // 8. updateApplicationStatus validates status value
  await test("updateApplicationStatus rejects invalid status with 400", async () => {
    const req = {
      params: { id: "app_1" },
      user: { _id: "employer_1", role: "employer" },
      body: { status: "InvalidStatusValue" },
    };
    const res = createMockRes();

    await updateApplicationStatus(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes("Invalid application status"));
  });

  // 9. updateApplicationStatus allows job owner to update status & action
  await test("updateApplicationStatus updates status and action for post owner", async () => {
    const origFindById = Application.findById;
    const mockApp = {
      _id: "app_1",
      status: "Application sent",
      action: "Download Copy",
      job: {
        _id: "job_1",
        postedBy: "owner_employer_id",
      },
      save: async function () { return this; },
    };

    Application.findById = () => ({
      populate: async () => mockApp,
    });

    try {
      const req = {
        params: { id: "app_1" },
        user: { _id: "owner_employer_id", role: "employer" },
        body: { status: "Interview scheduled" },
      };
      const res = createMockRes();

      await updateApplicationStatus(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(mockApp.status, "Interview scheduled");
      assert.strictEqual(mockApp.action, "View Invite");
    } finally {
      Application.findById = origFindById;
    }
  });

  // --- SECTION B: COMPANIES API TESTS ---

  // 10. getCompanies directory
  await test("getCompanies returns verified companies with pagination", async () => {
    const origCount = Company.countDocuments;
    const origFind = Company.find;
    const mockCompanies = [{ _id: "comp_1", name: "TechNova", status: "Verified" }];

    Company.countDocuments = async (q) => {
      assert.strictEqual(q.status, "Verified");
      return 1;
    };
    Company.find = () => ({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: async () => mockCompanies,
          }),
        }),
      }),
    });

    try {
      const req = { query: {} };
      const res = createMockRes();

      await getCompanies(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.count, 1);
      assert.deepStrictEqual(res.body.data, mockCompanies);
    } finally {
      Company.countDocuments = origCount;
      Company.find = origFind;
    }
  });

  // 11. createCompany validation failure
  await test("createCompany rejects missing required fields with 400", async () => {
    const req = {
      user: { _id: "employer_1", role: "employer" },
      body: { name: "Incomplete Company" }, // missing industry, email
    };
    const res = createMockRes();

    await createCompany(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes("company name, industry, and contact email"));
  });

  // 12. createCompany rejects duplicate profile for employer
  await test("createCompany rejects duplicate company profile for single employer with 409", async () => {
    const origFindOne = Company.findOne;
    Company.findOne = async () => ({ _id: "existing_company_id" });

    try {
      const req = {
        user: { _id: "employer_with_company", role: "employer" },
        body: {
          name: "Second Company",
          industry: "Tech",
          email: "second@tech.com",
        },
      };
      const res = createMockRes();

      await createCompany(req, res, () => {});

      assert.strictEqual(res.statusCode, 409);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("already has a registered company profile"));
    } finally {
      Company.findOne = origFindOne;
    }
  });

  // 13. createCompany creates company as Pending
  await test("createCompany registers company with status Pending and links to user", async () => {
    const origFindOne = Company.findOne;
    const origCreate = Company.create;
    const origUserUpdate = User.findByIdAndUpdate;

    let createdCompany = null;
    let linkedUserCompany = null;

    Company.findOne = async () => null;
    Company.create = async (data) => {
      createdCompany = data;
      return { _id: "new_company_id", ...data };
    };
    User.findByIdAndUpdate = async (userId, update) => {
      linkedUserCompany = update.company;
      return {};
    };

    try {
      const req = {
        user: { _id: "employer_1", role: "employer" },
        body: {
          name: "Dialog Axiata PLC",
          industry: "Telecommunications",
          email: "careers@dialog.lk",
          status: "Verified", // Attempting self-verification should be ignored
        },
      };
      const res = createMockRes();

      await createCompany(req, res, () => {});

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(createdCompany.status, "Pending"); // Must be Pending!
      assert.strictEqual(createdCompany.owner, "employer_1");
      assert.strictEqual(linkedUserCompany, "new_company_id");
    } finally {
      Company.findOne = origFindOne;
      Company.create = origCreate;
      User.findByIdAndUpdate = origUserUpdate;
    }
  });

  // 14. updateCompanyStatus admin-only verification
  await test("updateCompanyStatus allows admin to verify company with 200", async () => {
    const origFindById = Company.findById;
    const mockCompany = {
      _id: "comp_pending",
      status: "Pending",
      save: async function () { return this; },
    };
    Company.findById = async () => mockCompany;

    try {
      const req = {
        params: { id: "comp_pending" },
        user: { _id: "admin_id", role: "admin" },
        body: { status: "Verified" },
      };
      const res = createMockRes();

      await updateCompanyStatus(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(mockCompany.status, "Verified");
    } finally {
      Company.findById = origFindById;
    }
  });

  // 15. updateCompany blocks non-owner employer
  await test("updateCompany blocks unauthorized non-owner with 403", async () => {
    const origFindById = Company.findById;
    Company.findById = async () => ({
      _id: "comp_1",
      owner: "real_owner_id",
      save: async () => {},
    });

    try {
      const req = {
        params: { id: "comp_1" },
        user: { _id: "intruder_id", role: "employer" },
        body: { description: "Tampered" },
      };
      const res = createMockRes();

      await updateCompany(req, res, () => {});

      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.success, false);
    } finally {
      Company.findById = origFindById;
    }
  });

  // 16. Verify router endpoints registration
  test("applicationRoutes and companyRoutes stack contains all required endpoints", () => {
    const appRoutes = applicationRoutes.stack.map((l) => ({
      path: l.route.path,
      methods: Object.keys(l.route.methods),
    }));
    const compRoutes = companyRoutes.stack.map((l) => ({
      path: l.route.path,
      methods: Object.keys(l.route.methods),
    }));

    assert.ok(appRoutes.some((r) => r.path === "/" && r.methods.includes("post")), "Missing POST /api/applications");
    assert.ok(appRoutes.some((r) => r.path === "/me" && r.methods.includes("get")), "Missing GET /api/applications/me");
    assert.ok(appRoutes.some((r) => r.path === "/job/:jobId" && r.methods.includes("get")), "Missing GET /api/applications/job/:jobId");
    assert.ok(appRoutes.some((r) => r.path === "/:id/status" && r.methods.includes("patch")), "Missing PATCH /api/applications/:id/status");

    assert.ok(compRoutes.some((r) => r.path === "/" && r.methods.includes("get")), "Missing GET /api/companies");
    assert.ok(compRoutes.some((r) => r.path === "/:id" && r.methods.includes("get")), "Missing GET /api/companies/:id");
    assert.ok(compRoutes.some((r) => r.path === "/" && r.methods.includes("post")), "Missing POST /api/companies");
    assert.ok(compRoutes.some((r) => r.path === "/:id/status" && r.methods.includes("patch")), "Missing PATCH /api/companies/:id/status");
  });

  console.log(`\nPhase 6 Tests Completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
