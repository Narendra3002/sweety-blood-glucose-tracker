const request = require("supertest");
const app = require("../src/server");

describe("API authentication", () => {
  test("health endpoint works", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  test("readings endpoint requires authentication", async () => {
    const response = await request(app).get("/api/readings");

    expect(response.statusCode).toBe(401);
  });

  test("protected report requires authentication", async () => {
    const response = await request(app)
      .get("/api/reports/daily?date=2026-11-07");

    expect(response.statusCode).toBe(401);
  });
});
