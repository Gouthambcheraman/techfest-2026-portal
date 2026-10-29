process.env.JWT_SECRET = "test-secret";
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

const AJAX = { "X-Requested-With": "XMLHttpRequest" };
const testUserId = "507f1f77bcf86cd799439011";
const authCookie = (claims) => `token=${jwt.sign(claims, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" })}`;

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

  test("NoSQL injection registration payload is rejected", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set(AJAX)
      .send({ name: "Test User", email: { $ne: null }, password: "ValidPassword123" });
    expect(res.status).toBe(400);
  });

  test("invalid registration input is rejected", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set(AJAX)
      .send({ name: "A", email: "not-an-email", password: "short" });
    expect(res.status).toBe(400);
  });

  test("invalid login input is rejected before querying users", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set(AJAX)
      .send({ email: "not-an-email", password: "short" });
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

  test("protected account endpoint rejects requests without a token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  test("protected account endpoint rejects invalid JWTs", async () => {
    const token = jwt.sign({ id: testUserId }, "different-test-secret", { algorithm: "HS256", expiresIn: "1h" });
    const res = await request(app).get("/api/auth/me").set("Cookie", `token=${token}`);
    expect(res.status).toBe(401);
  });

  test("protected account endpoint rejects expired JWTs", async () => {
    const token = jwt.sign({ id: testUserId }, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: -1 });
    const res = await request(app).get("/api/auth/me").set("Cookie", `token=${token}`);
    expect(res.status).toBe(401);
  });

  test("protected account endpoint rejects JWTs without expiration", async () => {
    const token = jwt.sign({ id: testUserId }, process.env.JWT_SECRET, { algorithm: "HS256" });
    const res = await request(app).get("/api/auth/me").set("Cookie", `token=${token}`);
    expect(res.status).toBe(401);
  });

  test("feedback validation rejects empty messages before database writes", async () => {
    const res = await request(app)
      .post("/api/feedback")
      .set(AJAX)
      .set("Cookie", authCookie({ id: testUserId }))
      .send({ message: "   " });
    expect(res.status).toBe(400);
  });

  test("login endpoint rate limit blocks repeated requests", async () => {
    const ip = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
    let response;
    for (let attempt = 0; attempt < 11; attempt += 1) {
      response = await request(app)
        .post("/api/auth/login")
        .set(AJAX)
        .set("X-Forwarded-For", ip)
        .send({ email: "not-an-email", password: "ValidPassword123" });
    }
    expect(response.status).toBe(429);
  });

  test("registration endpoint has its own rate limit", async () => {
    const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;
    let response;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      response = await request(app)
        .post("/api/auth/register")
        .set(AJAX)
        .set("X-Forwarded-For", ip)
        .send({ name: "A", email: "not-an-email", password: "ValidPassword123" });
    }
    expect(response.status).toBe(429);
  });

  test("weak password is rejected on register", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .set(AJAX)
      .send({ name: "Test", email: "test@example.com", password: "123" });
    expect(res.status).toBe(400);
  });
});
