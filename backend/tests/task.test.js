const request = require("supertest");
const app = require("../server");

describe("CI/CD Pipeline Automated Tests - Practical 12", () => {
  // Test 1: Verify Health Check endpoint
  test("GET /api/health returns 200 and health status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });

  // Test 2: Verify GET /tasks endpoint (as specified in Practical 12 instructions)
  test("GET /tasks returns 200", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test 3: Verify GET /api/tasks alias endpoint
  test("GET /api/tasks returns 200", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
  });

  // Test 4: Verify 404 handler for undefined route
  test("GET /unknown-route returns 404", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.statusCode).toBe(404);
  });
});
