const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const {
  ENDPOINT_URL,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  JWT_SECRET,
} = require("../config/env");

function generateToken(user) {
  const tokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });
}

async function authenticateUser(email, password) {
  if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return {
      id: "admin-1",
      name: "admin",
      email: ADMIN_USERNAME,
      role: "admin",
    };
  }

  const { data: crudUsers } = await axios.get(`${ENDPOINT_URL}/users`);
  const user = crudUsers.find((u) => u.email === email);
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.passwordHash)) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function requireAuth(req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Requires admin role" });
  next();
}

module.exports = {
  generateToken,
  authenticateUser,
  requireAuth,
  requireAdmin,
};
