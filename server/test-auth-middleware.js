const assert = require("assert");
const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("./src/utils/generateToken");
const { protect } = require("./src/middleware/authMiddleware");
const { authorize, isStudent, isEmployer, isAdmin } = require("./src/middleware/roleMiddleware");
const { errorHandler, notFound } = require("./src/middleware/errorMiddleware");
const User = require("./src/models/User");

const TEST_SECRET = "super_secret_test_key_internlink_2026";
process.env.JWT_SECRET = TEST_SECRET;
process.env.JWT_EXPIRE = "1h";

console.log("Starting Phase 3 Authentication & Middleware Test Suite...\n");

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ FAIL: ${name}`);
      console.error(err);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
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

  // 1. Token Generation without secret
  test("generateToken throws if JWT_SECRET is unset", () => {
    const saved = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    assert.throws(
      () => generateToken("user123"),
      /JWT_SECRET is not set/
    );
    process.env.JWT_SECRET = saved;
  });

  // 2. Token Generation & Verification
  test("generateToken creates valid signed JWT containing payload", () => {
    const token = generateToken({ id: "user_abc", role: "student" });
    assert.strictEqual(typeof token, "string");
    assert.ok(token.split(".").length === 3);

    const decoded = verifyToken(token);
    assert.strictEqual(decoded.id, "user_abc");
    assert.strictEqual(decoded.role, "student");
  });

  // 3. Token Generation with string ID
  test("generateToken handles plain string ID", () => {
    const token = generateToken("user_plain");
    const decoded = verifyToken(token);
    assert.strictEqual(decoded.id, "user_plain");
  });

  // 4. Invalid Token
  test("verifyToken throws error on tampered/invalid token", () => {
    assert.throws(() => verifyToken("invalid.token.string"));
  });

  // 5. Expired Token
  test("verifyToken throws TokenExpiredError on expired token", () => {
    const expiredToken = jwt.sign(
      { id: "user_expired" },
      TEST_SECRET,
      { expiresIn: "1ms" }
    );
    // Wait small tick to ensure expiration
    const start = Date.now();
    while (Date.now() - start < 10) {}
    assert.throws(
      () => verifyToken(expiredToken),
      (err) => err.name === "TokenExpiredError"
    );
  });

  // 6. protect middleware rejects missing token
  await asyncTest("protect middleware returns 401 when no token is provided", async () => {
    let statusSet = null;
    let jsonSent = null;

    const req = { headers: {} };
    const res = {
      status(code) {
        statusSet = code;
        return this;
      },
      json(data) {
        jsonSent = data;
        return this;
      },
    };
    const next = () => {
      throw new Error("next() should not be called without token");
    };

    await protect(req, res, next);
    assert.strictEqual(statusSet, 401);
    assert.strictEqual(jsonSent.success, false);
    assert.ok(jsonSent.message.includes("No authentication token provided"));
  });

  // 7. protect middleware rejects invalid token
  await asyncTest("protect middleware returns 401 for malformed token", async () => {
    let statusSet = null;
    let jsonSent = null;

    const req = {
      headers: { authorization: "Bearer invalid_malformed_token" },
    };
    const res = {
      status(code) {
        statusSet = code;
        return this;
      },
      json(data) {
        jsonSent = data;
        return this;
      },
    };
    const next = () => {
      throw new Error("next() should not be called with invalid token");
    };

    await protect(req, res, next);
    assert.strictEqual(statusSet, 401);
    assert.strictEqual(jsonSent.success, false);
    assert.ok(jsonSent.message.includes("Invalid authentication token"));
  });

  // 8. protect middleware rejects expired token
  await asyncTest("protect middleware returns 401 for expired token", async () => {
    let statusSet = null;
    let jsonSent = null;

    const expiredToken = jwt.sign({ id: "user_test" }, TEST_SECRET, { expiresIn: "1ms" });
    const start = Date.now();
    while (Date.now() - start < 10) {}

    const req = {
      headers: { authorization: `Bearer ${expiredToken}` },
    };
    const res = {
      status(code) {
        statusSet = code;
        return this;
      },
      json(data) {
        jsonSent = data;
        return this;
      },
    };
    const next = () => {
      throw new Error("next() should not be called with expired token");
    };

    await protect(req, res, next);
    assert.strictEqual(statusSet, 401);
    assert.strictEqual(jsonSent.success, false);
    assert.ok(jsonSent.message.includes("Token has expired"));
  });

  // 9. protect middleware successfully attaches user when found in DB
  await asyncTest("protect middleware attaches user to req.user when token is valid", async () => {
    // Stub User.findById for this unit test
    const origFindById = User.findById;
    User.findById = (id) => ({
      select: (fields) => {
        assert.strictEqual(id, "mock_user_123");
        return Promise.resolve({
          _id: "mock_user_123",
          fullName: "Mock Student",
          email: "mock@student.com",
          role: "student",
          status: "Active",
        });
      },
    });

    const validToken = generateToken({ id: "mock_user_123", role: "student" });
    const req = {
      headers: { authorization: `Bearer ${validToken}` },
    };
    let nextCalled = false;
    const res = {
      status() { return this; },
      json() { return this; },
    };
    const next = () => {
      nextCalled = true;
    };

    try {
      await protect(req, res, next);
      assert.strictEqual(nextCalled, true);
      assert.ok(req.user);
      assert.strictEqual(req.user.fullName, "Mock Student");
      assert.strictEqual(req.user.role, "student");
    } finally {
      User.findById = origFindById;
    }
  });

  // 10. protect middleware works with cookie token
  await asyncTest("protect middleware accepts token from req.cookies.token", async () => {
    const origFindById = User.findById;
    User.findById = () => ({
      select: () => Promise.resolve({
        _id: "cookie_user",
        fullName: "Cookie User",
        email: "cookie@user.com",
        role: "employer",
        status: "Active",
      }),
    });

    const validToken = generateToken({ id: "cookie_user", role: "employer" });
    const req = {
      headers: {},
      cookies: { token: validToken },
    };
    let nextCalled = false;
    const res = {
      status() { return this; },
      json() { return this; },
    };
    const next = () => { nextCalled = true; };

    try {
      await protect(req, res, next);
      assert.strictEqual(nextCalled, true);
      assert.strictEqual(req.user.email, "cookie@user.com");
    } finally {
      User.findById = origFindById;
    }
  });

  // 11. Role authorization
  test("authorize middleware blocks unauthorized role with 403", () => {
    let statusSet = null;
    let jsonSent = null;

    const req = { user: { id: "1", role: "student" } };
    const res = {
      status(code) { statusSet = code; return this; },
      json(data) { jsonSent = data; return this; },
    };
    let nextCalled = false;

    const employerOnly = authorize("employer", "admin");
    employerOnly(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusSet, 403);
    assert.strictEqual(jsonSent.success, false);
    assert.strictEqual(nextCalled, false);
  });

  test("authorize middleware passes for authorized role", () => {
    const req = { user: { id: "2", role: "employer" } };
    let nextCalled = false;

    const employerOnly = authorize("employer", "admin");
    employerOnly(req, {}, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });

  test("authorize middleware rejects unauthenticated user with 401", () => {
    let statusSet = null;
    const req = {};
    const res = {
      status(code) { statusSet = code; return this; },
      json() { return this; },
    };

    isAdmin(req, res, () => {});
    assert.strictEqual(statusSet, 401);
  });

  // 12. Error handling middleware
  test("errorHandler formats Mongoose ValidationError as 400", () => {
    let statusSet = null;
    let jsonSent = null;

    const mockValidationError = {
      name: "ValidationError",
      errors: {
        email: { message: "Email is required" },
        fullName: { message: "Full name is required" },
      },
    };

    const res = {
      statusCode: 200,
      status(code) { statusSet = code; return this; },
      json(data) { jsonSent = data; return this; },
    };

    errorHandler(mockValidationError, {}, res, () => {});

    assert.strictEqual(statusSet, 400);
    assert.strictEqual(jsonSent.success, false);
    assert.ok(jsonSent.errors.includes("Email is required"));
  });

  test("errorHandler formats Mongoose CastError as 404", () => {
    let statusSet = null;
    let jsonSent = null;

    const mockCastError = {
      name: "CastError",
      value: "invalid_mongo_id",
    };

    const res = {
      statusCode: 200,
      status(code) { statusSet = code; return this; },
      json(data) { jsonSent = data; return this; },
    };

    errorHandler(mockCastError, {}, res, () => {});

    assert.strictEqual(statusSet, 404);
    assert.strictEqual(jsonSent.success, false);
    assert.ok(jsonSent.message.includes("invalid_mongo_id"));
  });

  test("errorHandler formats duplicate key error code 11000 as 409", () => {
    let statusSet = null;
    let jsonSent = null;

    const mockDuplicateError = {
      code: 11000,
      keyValue: { email: "test@example.com" },
    };

    const res = {
      statusCode: 200,
      status(code) { statusSet = code; return this; },
      json(data) { jsonSent = data; return this; },
    };

    errorHandler(mockDuplicateError, {}, res, () => {});

    assert.strictEqual(statusSet, 409);
    assert.strictEqual(jsonSent.success, false);
    assert.ok(jsonSent.message.includes("email already exists"));
  });

  console.log(`\nTests Completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
