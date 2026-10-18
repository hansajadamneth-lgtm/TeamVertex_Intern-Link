const assert = require("assert");
const User = require("./src/models/User");
const Job = require("./src/models/Job");
const Company = require("./src/models/Company");
const Application = require("./src/models/Application");

const {
  getAdminStats,
  getStudents,
  updateStudentStatus,
  getReports,
} = require("./src/controllers/adminController");
const adminRoutes = require("./src/routes/adminRoutes");

console.log("Starting Phase 7 Admin Analytics & Management API Test Suite...\n");

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

  // 1. getAdminStats returns real aggregated metrics
  await test("getAdminStats returns 200 with calculated database aggregates", async () => {
    const origUserCount = User.countDocuments;
    const origCompanyCount = Company.countDocuments;
    const origJobCount = Job.countDocuments;
    const origAppCount = Application.countDocuments;
    const origJobFind = Job.find;
    const origUserFind = User.find;

    User.countDocuments = async (q) => {
      if (q && q.role === "student") return 42;
      if (q && q.role === "employer") return 8;
      return 50;
    };
    Company.countDocuments = async (q) => {
      if (q && q.status === "Verified") return 6;
      if (q && q.status === "Pending") return 2;
      return 8;
    };
    Job.countDocuments = async (q) => {
      if (q && q.status === "Active") return 15;
      if (q && q.status === "Pending") return 3;
      if (q && q.status === "Closed") return 2;
      return 20;
    };
    Application.countDocuments = async () => 35;

    Job.find = () => ({
      sort: () => ({
        limit: () => ({
          select: async () => [{ title: "Frontend Intern", status: "Active" }],
        }),
      }),
    });

    User.find = () => ({
      sort: () => ({
        limit: () => ({
          select: async () => [{ fullName: "Sarah Student", role: "student" }],
        }),
      }),
    });

    try {
      const req = { user: { _id: "admin_1", role: "admin" } };
      const res = createMockRes();

      await getAdminStats(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.summary.totalStudents, 42);
      assert.strictEqual(res.body.data.summary.totalEmployers, 8);
      assert.strictEqual(res.body.data.summary.totalCompanies, 8);
      assert.strictEqual(res.body.data.summary.verifiedCompanies, 6);
      assert.strictEqual(res.body.data.summary.activeJobs, 15);
      assert.strictEqual(res.body.data.summary.totalApplications, 35);
      assert.strictEqual(res.body.data.recentJobs.length, 1);
      assert.strictEqual(res.body.data.recentUsers.length, 1);
    } finally {
      User.countDocuments = origUserCount;
      Company.countDocuments = origCompanyCount;
      Job.countDocuments = origJobCount;
      Application.countDocuments = origAppCount;
      Job.find = origJobFind;
      User.find = origUserFind;
    }
  });

  // 2. getStudents returns paginated student list
  await test("getStudents returns 200 with paginated student accounts", async () => {
    const origCount = User.countDocuments;
    const origFind = User.find;
    const mockStudents = [{ _id: "stu_1", fullName: "Ayesha Fernando", role: "student", status: "Active" }];

    User.countDocuments = async (q) => {
      assert.strictEqual(q.role, "student");
      return 1;
    };
    User.find = () => ({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            select: async () => mockStudents,
          }),
        }),
      }),
    });

    try {
      const req = {
        user: { _id: "admin_1", role: "admin" },
        query: { page: "1", limit: "10" },
      };
      const res = createMockRes();

      await getStudents(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.count, 1);
      assert.strictEqual(res.body.data[0].fullName, "Ayesha Fernando");
    } finally {
      User.countDocuments = origCount;
      User.find = origFind;
    }
  });

  // 3. updateStudentStatus validates status value
  await test("updateStudentStatus rejects invalid status with 400", async () => {
    const req = {
      params: { id: "stu_1" },
      user: { _id: "admin_1", role: "admin" },
      body: { status: "InvalidStudentStatus" },
    };
    const res = createMockRes();

    await updateStudentStatus(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes("Invalid student status"));
  });

  // 4. updateStudentStatus returns 404 for non-existent student
  await test("updateStudentStatus returns 404 if student does not exist", async () => {
    const origFindOne = User.findOne;
    User.findOne = async () => null;

    try {
      const req = {
        params: { id: "missing_stu" },
        user: { _id: "admin_1", role: "admin" },
        body: { status: "Inactive" },
      };
      const res = createMockRes();

      await updateStudentStatus(req, res, () => {});

      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.body.success, false);
    } finally {
      User.findOne = origFindOne;
    }
  });

  // 5. updateStudentStatus updates status
  await test("updateStudentStatus updates student status successfully with 200", async () => {
    const origFindOne = User.findOne;
    const mockStudent = {
      _id: "stu_1",
      fullName: "Michael Perera",
      email: "michael@email.com",
      status: "Pending",
      save: async function () { return this; },
    };
    User.findOne = async () => mockStudent;

    try {
      const req = {
        params: { id: "stu_1" },
        user: { _id: "admin_1", role: "admin" },
        body: { status: "Active" },
      };
      const res = createMockRes();

      await updateStudentStatus(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(mockStudent.status, "Active");
      assert.strictEqual(res.body.data.status, "Active");
    } finally {
      User.findOne = origFindOne;
    }
  });

  // 6. getReports returns analytics distribution
  await test("getReports returns 200 with jobs and applications distributions", async () => {
    const origJobCount = Job.countDocuments;
    const origAppCount = Application.countDocuments;
    const origUserCount = User.countDocuments;
    const origCompCount = Company.countDocuments;

    Job.countDocuments = async (q) => {
      if (!q || Object.keys(q).length === 0) return 42;
      if (q.status === "Active") return 28;
      if (q.status === "Pending") return 9;
      if (q.status === "Closed") return 5;
      if (q.category === "IT") return 25;
      return 5;
    };
    Application.countDocuments = async (q) => {
      if (!q || Object.keys(q).length === 0) return 110;
      if (q.status === "Application sent") return 40;
      if (q.status === "Under review") return 35;
      if (q.status === "Interview scheduled") return 20;
      return 15;
    };
    User.countDocuments = async () => 2450;
    Company.countDocuments = async () => 82;

    try {
      const req = { user: { _id: "admin_1", role: "admin" } };
      const res = createMockRes();

      await getReports(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.summary.totalApplications, 110);
      assert.strictEqual(res.body.data.summary.totalCompanies, 82);
      assert.strictEqual(res.body.data.summary.totalInternships, 42);
      assert.strictEqual(res.body.data.summary.totalStudents, 2450);
      assert.strictEqual(res.body.data.jobsByStatus.Active, 28);
      assert.strictEqual(res.body.data.jobsByStatus.Pending, 9);
      assert.strictEqual(res.body.data.jobsByStatus.Closed, 5);
    } finally {
      Job.countDocuments = origJobCount;
      Application.countDocuments = origAppCount;
      User.countDocuments = origUserCount;
      Company.countDocuments = origCompCount;
    }
  });

  // 7. Verify adminRoutes stack endpoints
  test("adminRoutes router registers /stats, /students, /students/:id/status, and /reports", () => {
    const routes = adminRoutes.stack
      .filter((layer) => layer.route)
      .map((layer) => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));

    assert.ok(routes.some((r) => r.path === "/stats" && r.methods.includes("get")), "Missing GET /stats");
    assert.ok(routes.some((r) => r.path === "/students" && r.methods.includes("get")), "Missing GET /students");
    assert.ok(routes.some((r) => r.path === "/students/:id/status" && r.methods.includes("patch")), "Missing PATCH /students/:id/status");
    assert.ok(routes.some((r) => r.path === "/reports" && r.methods.includes("get")), "Missing GET /reports");
  });

  console.log(`\nPhase 7 Tests Completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
