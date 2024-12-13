const express = require("express");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const { requireAuth, requireAdmin } = require("../middleware/authHelper");
const { ENDPOINT_URL } = require("../config/env");

const router = express.Router();

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { data: crudUsers } = await axios.get(`${ENDPOINT_URL}/users`);
    const sanitizedUsers = crudUsers.map(({ passwordHash, ...rest }) => rest);
    res.json(sanitizedUsers);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name)
    return res
      .status(400)
      .json({ message: "name, email and password are required" });
  try {
    const { data: existingUsers } = await axios.get(`${ENDPOINT_URL}/users`);
    if (existingUsers.find((u) => u.email === email))
      return res.status(400).json({ message: "User already exists" });
    const newUser = {
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      role: "user",
    };
    const { data: createdUser } = await axios.post(
      `${ENDPOINT_URL}/users`,
      newUser
    );
    const { passwordHash, ...rest } = createdUser;
    res.status(201).json(rest);
  } catch {
    res.status(500).json({ message: "Failed to create user" });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  if (!name || !email || !role)
    return res
      .status(400)
      .json({ message: "name, email, and role are required" });

  try {
    const { data: existingUsers } = await axios.get(`${ENDPOINT_URL}/users`);
    const userToUpdate = existingUsers.find((u) => u._id === id);
    if (!userToUpdate)
      return res.status(404).json({ message: "User not found" });

    const updatedUser = { name, email, role };
    await axios.put(`${ENDPOINT_URL}/users/${id}`, updatedUser);
    res.json({ ...updatedUser, _id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const { data: existingUsers } = await axios.get(`${ENDPOINT_URL}/users`);
    const userToDelete = existingUsers.find((u) => u._id === id);
    if (!userToDelete)
      return res.status(404).json({ message: "User not found" });
    await axios.delete(`${ENDPOINT_URL}/users/${id}`);
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
