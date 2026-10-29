// DEMO ONLY - "before" version used to show the NoSQL injection problem.
// Run on a TEST COPY of the project. Never deploy this file.
//
// Attack (Postman / Thunder Client):
//   POST http://localhost:5000/api/auth/login
//   {"email": {"$ne": null}, "password": {"$ne": null}}
// Because req.body goes straight into findOne(), MongoDB reads $ne as an
// operator and returns the first user -> login bypass.
const router = require("express").Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email, password: req.body.password }); // VULNERABLE
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ message: "Logged in as " + user.email });
});

module.exports = router;
