process.env.JWT_SECRET = "test-secret";
const request = require("supertest");
const app = require("../app");

const AJAX = { "X-Requested-With": "XMLHttpRequest" };

describe("TechFest API security", () => {
  test("health check returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("Helmet security headers are present", async () => {
    const res = await request(app).get("/api/health");
    expect(res.headers["content-security-policy"]).toBeDefined();
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  test("NoSQL injection login payload is rejected", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set(AJAX)
      .send({ email: { $ne: null }, password: { $ne: null } });
    expect(res.status).toBe(400);
  });

  test("POST without X-Requested-With header is blocked (CSRF)", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "a@b.com", password: "12345678" });
    expect(res.status).toBe(403);
  });

  test("feedback requires login", async () => {
    const res = await request(app).post("/api/feedback").set(AJAX).send({ message: "<script>alert('hi')</script>" });
    expect(res.status).toBe(401);
  });

  test("weak password is rejected on register", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set(AJAX)
      .send({ name: "Test", email: "test@example.com", password: "123" });
    expect(res.status).toBe(400);
  });
});
