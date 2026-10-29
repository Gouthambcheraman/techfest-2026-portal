const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const Feedback = require("../models/Feedback");
const requireAuth = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  try {
    const items = await Feedback.find().populate("user", "name").sort({ createdAt: -1 }).limit(50);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  requireAuth,
  // .escape() turns < > & ' " into HTML entities -> stored text can never run as a script
  body("message").isString().trim().isLength({ min: 1, max: 500 }).withMessage("Message must be 1-500 characters").escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
      const item = await Feedback.create({ user: req.user.id, message: req.body.message });
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
