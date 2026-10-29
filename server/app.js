const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const feedbackRoutes = require("./routes/feedback");

const app = express();
app.set("trust proxy", 1); // Render sits behind a proxy (needed for secure cookies + rate limit)

// Security headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options ...)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"], // blocks inline <script> -> mitigates XSS
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);

app.use(compression());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Strips $ and . operators from body/query/params -> blocks NoSQL injection
app.use(mongoSanitize());

// Simple CSRF defence on top of SameSite: state-changing requests must carry a
// custom header, which a cross-site HTML form cannot send.
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.get("X-Requested-With") !== "XMLHttpRequest") {
    return res.status(403).json({ error: "Missing X-Requested-With header" });
  }
  next();
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false });

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

module.exports = app;
