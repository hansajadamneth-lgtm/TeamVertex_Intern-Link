const assert = require("assert");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
} = require("./src/controllers/authController");
const authRoutes = require("./src/routes/authRoutes");
const { generateToken } = require("./src/utils/generateToken");

process.env.JWT_SECRET = "super_secret_test_key_phase4_2026";
process.env.JWT_EXPIRE = "1h";

console.log("Starting Phase 4 Authentication Controllers & Routes Test Suite...\n");

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    cookies: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    cookie(name, val, opts) {
      this.cookies[name] = { val, opts };
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
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

  // 1. Missing fields in registration
  await test("registerUser rejects missing fields with 400", async () => {
    const req = { body: { fullName: "Test User", email: "" } };
    const res = createMockRes();
    let nextCalled = false;

    await registerUser(req, res, () => { nextCalled = true; });

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes("fullName, email, and password"));
    assert.strictEqual(nextCalled, false);
  });

  // 2. Short password in registration
  await test("registerUser rejects password shorter than 6 characters with 400", async () => {
    const req = { body: { fullName: "Test User", email: "test@example.com", password: "123" } };
    const res = createMockRes();

    await registerUser(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes("at least 6 characters"));
  });

  // 3. Admin role registration rejection
  await test("registerUser blocks public registration for 'admin' role with 400", async () => {
    const req = {
      body: {
        fullName: "Admin Attempt",
        email: "admin@example.com",
        password: "securePassword123",
        role: "admin",
      },
    };
    const res = createMockRes();

    await registerUser(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes("Public registration is only permitted for 'student' or 'employer'"));
  });

  // 4. Invalid role registration rejection
  await test("registerUser blocks public registration for unknown roles with 400", async () => {
    const req = {
      body: {
        fullName: "Hacker",
        email: "hacker@example.com",
        password: "securePassword123",
        role: "superuser",
      },
    };
    const res = createMockRes();

    await registerUser(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  // 5. Duplicate email rejection
  await test("registerUser rejects duplicate email with 409", async () => {
    const origFindOne = User.findOne;
    User.findOne = async () => ({ _id: "existing_id", email: "existing@example.com" });

    try {
      const req = {
        body: {
          fullName: "New Student",
          email: "existing@example.com",
          password: "password123",
          role: "student",
        },
      };
      const res = createMockRes();

      await registerUser(req, res, () => {});

      assert.strictEqual(res.statusCode, 409);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("already exists"));
    } finally {
      User.findOne = origFindOne;
    }
  });

  // 6. Successful student registration
  await test("registerUser creates student successfully with 201 and HttpOnly cookie", async () => {
    const origFindOne = User.findOne;
    const origCreate = User.create;

    User.findOne = async () => null;
    User.create = async (userData) => ({
      _id: "new_student_id",
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString(),
    });

    try {
      const req = {
        body: {
          fullName: "Hansaja Damneth",
          email: "HANSAJA@example.com",
          password: "password123",
          role: "student",
        },
      };
      const res = createMockRes();

      await registerUser(req, res, () => {});

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.token, undefined);
      assert.strictEqual(res.body.user.fullName, "Hansaja Damneth");
      assert.strictEqual(res.body.user.email, "hansaja@example.com");
      assert.strictEqual(res.body.user.role, "student");
      assert.strictEqual(res.body.user.password, undefined);
      assert.ok(res.cookies.token);
    } finally {
      User.findOne = origFindOne;
      User.create = origCreate;
    }
  });

  // 7. Successful employer registration
  await test("registerUser creates employer successfully with 201", async () => {
    const origFindOne = User.findOne;
    const origCreate = User.create;

    User.findOne = async () => null;
    User.create = async (userData) => ({
      _id: "new_employer_id",
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role,
      createdAt: new Date().toISOString(),
    });

    try {
      const req = {
        body: {
          fullName: "TechCorp Recruiter",
          email: "recruiter@techcorp.com",
          password: "password123",
          role: "employer",
        },
      };
      const res = createMockRes();

      await registerUser(req, res, () => {});

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.role, "employer");
    } finally {
      User.findOne = origFindOne;
      User.create = origCreate;
    }
  });

  // 8. loginUser missing email or password
  await test("loginUser rejects missing email or password with 400", async () => {
    const req = { body: { email: "test@example.com" } };
    const res = createMockRes();

    await loginUser(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes("both email and password"));
  });

  // 9. loginUser user not found
  await test("loginUser rejects non-existent user with 401", async () => {
    const origFindOne = User.findOne;
    User.findOne = () => ({
      select: async () => null,
    });

    try {
      const req = { body: { email: "notfound@example.com", password: "password123" } };
      const res = createMockRes();

      await loginUser(req, res, () => {});

      assert.strictEqual(res.statusCode, 401);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("Invalid email or password"));
    } finally {
      User.findOne = origFindOne;
    }
  });

  // 10. loginUser incorrect password
  await test("loginUser rejects incorrect password with 401", async () => {
    const origFindOne = User.findOne;
    User.findOne = () => ({
      select: async () => ({
        _id: "user_123",
        email: "user@example.com",
        password: "hashed_password",
        comparePassword: async () => false,
      }),
    });

    try {
      const req = { body: { email: "user@example.com", password: "wrong_password" } };
      const res = createMockRes();

      await loginUser(req, res, () => {});

      assert.strictEqual(res.statusCode, 401);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("Invalid email or password"));
    } finally {
      User.findOne = origFindOne;
    }
  });

  // 11. loginUser inactive user rejection
  await test("loginUser rejects inactive account with 403", async () => {
    const origFindOne = User.findOne;
    User.findOne = () => ({
      select: async () => ({
        _id: "user_inactive",
        email: "inactive@example.com",
        status: "Inactive",
        comparePassword: async () => true,
      }),
    });

    try {
      const req = { body: { email: "inactive@example.com", password: "password123" } };
      const res = createMockRes();

      await loginUser(req, res, () => {});

      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes("account is currently inactive"));
    } finally {
      User.findOne = origFindOne;
    }
  });

  // 12. loginUser successful authentication
  await test("loginUser succeeds with 200, HttpOnly cookie, and sanitized profile", async () => {
    const origFindOne = User.findOne;
    User.findOne = () => ({
      select: async () => ({
        _id: "user_valid",
        fullName: "Hansaja Damneth",
        email: "hansaja@example.com",
        role: "student",
        status: "Active",
        createdAt: new Date().toISOString(),
        comparePassword: async () => true,
      }),
    });

    try {
      const req = { body: { email: "hansaja@example.com", password: "password123" } };
      const res = createMockRes();

      await loginUser(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(typeof res.body.token, "string");
      assert.strictEqual(res.body.user.fullName, "Hansaja Damneth");
      assert.strictEqual(res.body.user.email, "hansaja@example.com");
      assert.strictEqual(res.body.user.role, "student");
      assert.strictEqual(res.body.user.password, undefined);
      assert.ok(res.cookies.token);
    } finally {
      User.findOne = origFindOne;
    }
  });

  // 13. getMe returns authenticated user
  await test("getMe returns 200 and profile from req.user", async () => {
    const req = {
      user: {
        _id: "auth_user_id",
        fullName: "Hansaja Damneth",
        email: "hansaja@example.com",
        role: "student",
        skills: ["React", "TypeScript", "Node.js"],
        status: "Active",
        createdAt: new Date().toISOString(),
      },
    };
    const res = createMockRes();

    await getMe(req, res, () => {});

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.id, "auth_user_id");
    assert.strictEqual(res.body.user.fullName, "Hansaja Damneth");
    assert.deepStrictEqual(res.body.user.skills, ["React", "TypeScript", "Node.js"]);
  });

  // 14. getMe rejects unauthenticated request
  await test("getMe returns 401 when req.user is absent", async () => {
    const req = {};
    const res = createMockRes();

    await getMe(req, res, () => {});

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
  });

  // 15. forgotPassword validation & safe response
  await test("forgotPassword rejects empty email with 400", async () => {
    const req = { body: {} };
    const res = createMockRes();

    await forgotPassword(req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  await test("forgotPassword returns 200 without exposing tokens or secrets", async () => {
    const origFindOne = User.findOne;
    User.findOne = async () => ({ _id: "user_found" });

    try {
      const req = { body: { email: "user@example.com" } };
      const res = createMockRes();

      await forgotPassword(req, res, () => {});

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.token, undefined);
      assert.strictEqual(res.body.resetToken, undefined);
      assert.ok(res.body.message.includes("Password reset request received"));
    } finally {
      User.findOne = origFindOne;
    }
  });

  // 16. Verify router has registered endpoints
  test("authRoutes router has register, login, me, and forgot-password endpoints", () => {
    const routes = authRoutes.stack.map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));

    const hasRegister = routes.some((r) => r.path === "/register" && r.methods.includes("post"));
    const hasLogin = routes.some((r) => r.path === "/login" && r.methods.includes("post"));
    const hasMe = routes.some((r) => r.path === "/me" && r.methods.includes("get"));
    const hasForgotPassword = routes.some((r) => r.path === "/forgot-password" && r.methods.includes("post"));

    assert.ok(hasRegister, "Must have POST /register");
    assert.ok(hasLogin, "Must have POST /login");
    assert.ok(hasMe, "Must have GET /me");
    assert.ok(hasForgotPassword, "Must have POST /forgot-password");
  });

  console.log(`\nPhase 4 Tests Completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
