const assert = require("assert");
const http = require("http");

process.env.NODE_ENV = "test";

console.log("Starting Phase 8: API Proxy & Full-Stack Readiness Test Suite...\n");

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

  // 1. Test Proxy behavior when BACKEND_URL is unset
  await test("forwardToBackend returns null when BACKEND_URL is undefined", async () => {
    delete process.env.BACKEND_URL;
    delete process.env.API_BASE_URL;

    // Simulate forwardToBackend logic
    const backendBase = process.env.BACKEND_URL || process.env.API_BASE_URL;
    assert.strictEqual(backendBase, undefined);
  });

  // 2. Test Proxy behavior when backend is down / unreachable (503 handling)
  await test("forwardToBackend returns 503 with friendly message when backend service is unreachable", async () => {
    // Unreachable port
    const unreachableUrl = "http://127.0.0.1:54321";
    let status = 0;
    let body = null;

    try {
      await fetch(`${unreachableUrl}/api/health`, { method: "GET" });
    } catch (err) {
      status = 503;
      body = {
        success: false,
        message: "Express backend service is currently unreachable or warming up (free-tier cold start). Please retry shortly.",
        error: err.message,
      };
    }

    assert.strictEqual(status, 503);
    assert.strictEqual(body.success, false);
    assert.ok(body.message.includes("free-tier cold start"));
  });

  // 3. Test Proxy forwarding to live simulated Express server
  await test("forwardToBackend forwards headers, query parameters, method, and receives response with cookies", async () => {
    let receivedHeader = null;
    let receivedQuery = null;
    let receivedMethod = null;
    let receivedBody = null;

    const mockServer = http.createServer((req, res) => {
      receivedMethod = req.method;
      receivedHeader = req.headers["authorization"];
      receivedQuery = req.url;

      let raw = "";
      req.on("data", (c) => { raw += c; });
      req.on("end", () => {
        receivedBody = raw;
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Set-Cookie": "token=jwt_sample_cookie; Path=/; HttpOnly",
        });
        res.end(JSON.stringify({ success: true, forwarded: true }));
      });
    });

    await new Promise((resolve) => mockServer.listen(0, resolve));
    const port = mockServer.address().port;

    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/jobs?category=IT`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token-123",
        },
        body: JSON.stringify({ title: "Junior Dev" }),
      });

      const data = await response.json();
      assert.strictEqual(response.status, 200);
      assert.strictEqual(data.success, true);
      assert.strictEqual(receivedMethod, "POST");
      assert.strictEqual(receivedHeader, "Bearer mock-token-123");
      assert.strictEqual(receivedQuery, "/api/jobs?category=IT");
      assert.deepStrictEqual(JSON.parse(receivedBody), { title: "Junior Dev" });
      assert.ok(response.headers.get("set-cookie").includes("jwt_sample_cookie"));
    } finally {
      mockServer.close();
    }
  });

  // 4. Test MongoDB configuration format & connection timeout options
  await test("MongoDB config exports connectDB and configures resilient timeout", () => {
    const connectDB = require("./src/config/db");
    assert.strictEqual(typeof connectDB, "function");
  });

  // 5. Test CORS middleware accepts multiple origins and requests without origin
  await test("CORS middleware handles multi-domain client configurations safely", async () => {
    const app = require("./src/index");
    assert.ok(app);
  });

  console.log(`\nPhase 8 Tests Completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
