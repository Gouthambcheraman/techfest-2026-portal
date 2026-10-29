const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const isProd = process.env.NODE_ENV === "production";

// httpOnly: JS cannot read it (XSS can't steal the token)
// secure:   only sent over HTTPS
// sameSite: 'none' is required when frontend and API are on different domains
//           (Netlify + Render); it is only allowed together with secure=true.
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 60 * 60 * 1000, // 1 hour
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  next();
};

// .isString() rejects objects like {"$ne": null} (NoSQL injection payloads)
const emailRule = body("email").isString().withMessage("Email must be text").bail().isEmail().withMessage("Invalid email").normalizeEmail();
const passwordRule = body("password").isString().withMessage("Password must be text").bail().isLength({ min: 8, max: 72 }).withMessage("Password must be 8-72 characters");

router.post(
  "/register",
  body("name").isString().trim().isLength({ min: 2, max: 60 }).escape().withMessage("Name must be 2-60 characters"),
  emailRule,
  passwordRule,
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      if (await User.findOne({ email })) return res.status(409).json({ error: "Email already registered" });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash });
      res.status(201).json({ id: user._id, name: user.name, email: user.email });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", emailRule, passwordRule, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, cookieOptions).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined }).json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => res.json({ id: req.user.id, name: req.user.name }));

module.exports = router;
