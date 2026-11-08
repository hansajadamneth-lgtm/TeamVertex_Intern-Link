const assert = require("assert");
const Job = require("./src/models/Job");
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("./src/controllers/jobController");
const jobRoutes = require("./src/routes/jobRoutes");

console.log("Starting Phase 5 Internship Jobs API Test Suite...\n");

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

  // 1. getJobs public listing with pagination
  await test("getJobs returns 200 with list, total, and pagination", async () => {
    const origCountDocuments = Job.countDocuments;
    const origFind = Job.find;

    const mockJobs = [
      { _id: "job_1", title: "Frontend Intern", companyName: "TechNova", status: "Active" },
      { _id: "job_2", title: "Backend Intern", companyName: "InnovateX", status: "Active" },
    ];

    Job.countDocuments = async () => 2;
    Job.find = () => ({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: () => ({
              populate: async () => mockJobs,
            }),
          }),
        }),
      }),
    });

    try {
      const req = { query: { page: "1", limit: "10" } };
      const res = createMockRes();

      await getJobs(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.count, 2);
      assert.strictEqual(res.body.total, 2);
      assert.strictEqual(res.body.pagination.page, 1);
      assert.deepStrictEqual(res.body.data, mockJobs);
    } finally {
      Job.countDocuments = origCountDocuments;
      Job.find = origFind;
    }
  });

  // 2. getJobs handles category and search filters
  await test("getJobs applies category, type, and keyword query filters", async () => {
    const origCountDocuments = Job.countDocuments;
    const origFind = Job.find;
    let capturedQuery = null;

    Job.countDocuments = async (q) => {
      capturedQuery = q;
      return 1;
    };
    Job.find = (q) => ({
      sort: () => ({
        skip: () => ({
          limit: () => ({
            populate: () => ({
              populate: async () => [{ _id: "job_it", category: "IT" }],
            }),
          }),
        }),
      }),
    });

    try {
      const req = { query: { category: "IT", type: "Full Time", search: "react" } };
      const res = createMockRes();

      await getJobs(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(capturedQuery.category, "IT");
      assert.strictEqual(capturedQuery.type, "Full Time");
      assert.strictEqual(capturedQuery.status, "Active");
      assert.ok(Array.isArray(capturedQuery.$or));
    } finally {
      Job.countDocuments = origCountDocuments;
      Job.find = origFind;
    }
  });

  // 3. getJobById success
  await test("getJobById returns 200 with job details", async () => {
    const origFindById = Job.findById;
    Job.findById = (id) => ({
      populate: () => ({
        populate: async () => ({ _id: id, title: "Data Analyst Intern", status: "Active" }),
      }),
    });

    try {
      const req = { params: { id: "job_123" } };
      const res = createMockRes();

      await getJobById(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data._id, "job_123");
    } finally {
      Job.findById = origFindById;
    }
  });

  // 4. getJobById not found (404)
  await test("getJobById returns 404 when job does not exist", async () => {
    const origFindById = Job.findById;
    Job.findById = () => ({
      populate: () => ({
        populate: async () => null,
      }),
    });

    try {
      const req = { params: { id: "non_existent_id" } };
      const res = createMockRes();

      await getJobById(req, res, () => {});

      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("not found"));
    } finally {
      Job.findById = origFindById;
    }
  });

  // 5. createJob validation failure (400)
  await test("createJob rejects missing required fields with 400", async () => {
    const req = {
      user: { _id: "employer_1", role: "employer" },
      body: { title: "Software Intern" }, // missing companyName, location, description
    };
    const res = createMockRes();

    await createJob(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes("title, companyName, location, and description"));
  });

  // 6. createJob derives postedBy from req.user
  await test("createJob forces postedBy to authenticated req.user._id", async () => {
    const origCreate = Job.create;
    let capturedData = null;

    Job.create = async (data) => {
      capturedData = data;
      return { _id: "new_job_id", ...data };
    };

    try {
      const req = {
        user: { _id: "authenticated_employer_id", role: "employer" },
        body: {
          title: "Full Stack Intern",
          companyName: "TechNova",
          location: "Colombo",
          description: "Hands-on internship",
          skills: "React, Node.js, TypeScript",
          postedBy: "untrusted_client_id_attempt", // should be ignored
        },
      };
      const res = createMockRes();

      await createJob(req, res, () => {});

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(capturedData.postedBy, "authenticated_employer_id");
      assert.deepStrictEqual(capturedData.skills, ["React", "Node.js", "TypeScript"]);
    } finally {
      Job.create = origCreate;
    }
  });

  // 7. updateJob 404 on missing job
  await test("updateJob returns 404 if post does not exist", async () => {
    const origFindById = Job.findById;
    Job.findById = async () => null;

    try {
      const req = {
        params: { id: "missing_id" },
        user: { _id: "employer_1", role: "employer" },
        body: { title: "Updated Title" },
      };
      const res = createMockRes();

      await updateJob(req, res, () => {});

      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.body.success, false);
    } finally {
      Job.findById = origFindById;
    }
  });

  // 8. updateJob blocks non-owner employer (403)
  await test("updateJob rejects non-owner employer with 403", async () => {
    const origFindById = Job.findById;
    Job.findById = async () => ({
      _id: "job_1",
      postedBy: "different_employer_id",
      title: "Original Title",
      save: async () => {},
    });

    try {
      const req = {
        params: { id: "job_1" },
        user: { _id: "malicious_employer_id", role: "employer" },
        body: { title: "Hacked Title" },
      };
      const res = createMockRes();

      await updateJob(req, res, () => {});

      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("You can only update posts created by your account"));
    } finally {
      Job.findById = origFindById;
    }
  });

  // 9. updateJob allows post owner
  await test("updateJob allows post owner employer to update fields", async () => {
    const origFindById = Job.findById;
    const mockJob = {
      _id: "job_1",
      postedBy: "owner_employer_id",
      title: "Original Title",
      save: async function () { return this; },
    };
    Job.findById = async () => mockJob;

    try {
      const req = {
        params: { id: "job_1" },
        user: { _id: "owner_employer_id", role: "employer" },
        body: { title: "Updated Software Intern", duration: "6 Months" },
      };
      const res = createMockRes();

      await updateJob(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(mockJob.title, "Updated Software Intern");
      assert.strictEqual(mockJob.duration, "6 Months");
    } finally {
      Job.findById = origFindById;
    }
  });

  // 10. updateJob allows admin
  await test("updateJob allows admin to update any post", async () => {
    const origFindById = Job.findById;
    const mockJob = {
      _id: "job_1",
      postedBy: "some_other_id",
      title: "Pending Post",
      status: "Pending",
      save: async function () { return this; },
    };
    Job.findById = async () => mockJob;

    try {
      const req = {
        params: { id: "job_1" },
        user: { _id: "admin_user_id", role: "admin" },
        body: { status: "Active" },
      };
      const res = createMockRes();

      await updateJob(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(mockJob.status, "Active");
    } finally {
      Job.findById = origFindById;
    }
  });

  // 11. deleteJob blocks non-owner employer
  await test("deleteJob rejects non-owner employer with 403", async () => {
    const origFindById = Job.findById;
    Job.findById = async () => ({
      _id: "job_1",
      postedBy: "owner_id",
      save: async () => {},
    });

    try {
      const req = {
        params: { id: "job_1" },
        query: {},
        user: { _id: "other_employer_id", role: "employer" },
      };
      const res = createMockRes();

      await deleteJob(req, res, () => {});

      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.success, false);
    } finally {
      Job.findById = origFindById;
    }
  });

  // 12. deleteJob closes post by default
  await test("deleteJob safe closure sets status to 'Closed'", async () => {
    const origFindById = Job.findById;
    const mockJob = {
      _id: "job_1",
      postedBy: "owner_id",
      status: "Active",
      save: async function () { return this; },
    };
    Job.findById = async () => mockJob;

    try {
      const req = {
        params: { id: "job_1" },
        query: {},
        user: { _id: "owner_id", role: "employer" },
      };
      const res = createMockRes();

      await deleteJob(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(mockJob.status, "Closed");
      assert.ok(res.body.message.includes("closed successfully"));
    } finally {
      Job.findById = origFindById;
    }
  });

  // 13. deleteJob permanent delete
  await test("deleteJob with ?permanent=true invokes deleteOne()", async () => {
    const origFindById = Job.findById;
    let deleteCalled = false;
    const mockJob = {
      _id: "job_1",
      postedBy: "owner_id",
      deleteOne: async () => { deleteCalled = true; },
    };
    Job.findById = async () => mockJob;

    try {
      const req = {
        params: { id: "job_1" },
        query: { permanent: "true" },
        user: { _id: "admin_id", role: "admin" },
      };
      const res = createMockRes();

      await deleteJob(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(deleteCalled, true);
      assert.ok(res.body.message.includes("permanently removed"));
    } finally {
      Job.findById = origFindById;
    }
  });

  // 14. Router endpoint registration verification
  test("jobRoutes router registers GET /, GET /:id, POST /, PUT /:id, DELETE /:id", () => {
    const routes = jobRoutes.stack.map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));

    const hasGetList = routes.some((r) => r.path === "/" && r.methods.includes("get"));
    const hasGetOne = routes.some((r) => r.path === "/:id" && r.methods.includes("get"));
    const hasCreate = routes.some((r) => r.path === "/" && r.methods.includes("post"));
    const hasUpdate = routes.some((r) => r.path === "/:id" && r.methods.includes("put"));
    const hasDelete = routes.some((r) => r.path === "/:id" && r.methods.includes("delete"));

    assert.ok(hasGetList, "Missing GET /");
    assert.ok(hasGetOne, "Missing GET /:id");
    assert.ok(hasCreate, "Missing POST /");
    assert.ok(hasUpdate, "Missing PUT /:id");
    assert.ok(hasDelete, "Missing DELETE /:id");
  });

  console.log(`\nPhase 5 Tests Completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
