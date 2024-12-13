const express = require("express");
const axios = require("axios");
const { requireAuth, requireAdmin } = require("../middleware/authHelper");
const { ENDPOINT_URL } = require("../config/env");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "name, email, password required" });
  try {
    const newRequest = { name, email, password };
    const { data: createdReq } = await axios.post(
      `${ENDPOINT_URL}/waitlist`,
      newRequest
    );
    res.status(201).json(createdReq);
  } catch {
    res.status(500).json({ message: "Failed to create waitlist entry" });
  }
});

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { data: requests } = await axios.get(`${ENDPOINT_URL}/waitlist`);
    res.json(requests);
  } catch {
    res.status(500).json({ message: "Failed to fetch waitlist" });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await axios.delete(`${ENDPOINT_URL}/waitlist/${id}`);
    res.json({ message: "Request removed" });
  } catch {
    res.status(500).json({ message: "Failed to remove waitlist entry" });
  }
});

module.exports = router;
