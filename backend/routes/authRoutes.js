const express = require("express");
const { generateToken, authenticateUser } = require("../middleware/authHelper");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = generateToken(user);
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });
  res.json({ message: "Logged in successfully" });
});

module.exports = router;
