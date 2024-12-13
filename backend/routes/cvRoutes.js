const express = require("express");
const axios = require("axios");
const { requireAuth } = require("../middleware/authHelper");
const { ENDPOINT_URL } = require("../config/env");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { data: crudCVs } = await axios.get(`${ENDPOINT_URL}/cvs`);
    if (req.user.role === "admin") {
      res.json(crudCVs);
    } else {
      const userCVs = crudCVs.filter((cv) => cv.userEmail === req.user.email);
      res.json(userCVs);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch CVs" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { personalInfo, skills, education, experience, references } = req.body;
  if (!personalInfo || !personalInfo.name || !personalInfo.email) {
    return res
      .status(400)
      .json({ message: "Missing required personalInfo fields" });
  }

  try {
    const newCV = {
      userEmail: req.user.email,
      personalInfo,
      skills: skills || [],
      education: education || [],
      experience: experience || [],
      references: references || [],
    };
    const { data: createdCV } = await axios.post(`${ENDPOINT_URL}/cvs`, newCV);
    res.status(201).json(createdCV);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create CV" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { personalInfo, skills, education, experience, references } = req.body;

  try {
    const { data: existingCVs } = await axios.get(`${ENDPOINT_URL}/cvs`);
    const cvToUpdate = existingCVs.find((cv) => cv._id === id);
    if (!cvToUpdate) return res.status(404).json({ message: "CV not found" });

    if (req.user.role !== "admin" && cvToUpdate.userEmail !== req.user.email) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this CV" });
    }

    const updatedCV = {
      ...cvToUpdate,
      personalInfo: personalInfo || cvToUpdate.personalInfo,
      skills: Array.isArray(skills) ? skills : cvToUpdate.skills,
      education: Array.isArray(education) ? education : cvToUpdate.education,
      experience: Array.isArray(experience)
        ? experience
        : cvToUpdate.experience,
      references: Array.isArray(references)
        ? references
        : cvToUpdate.references,
    };

    const { _id, ...cvWithoutId } = updatedCV;
    await axios.put(`${ENDPOINT_URL}/cvs/${id}`, cvWithoutId);
    res.json(updatedCV);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update CV" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const { data: existingCVs } = await axios.get(`${ENDPOINT_URL}/cvs`);
    const cvToDelete = existingCVs.find((cv) => cv._id === id);
    if (!cvToDelete) return res.status(404).json({ message: "CV not found" });

    if (req.user.role !== "admin" && cvToDelete.userEmail !== req.user.email) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this CV" });
    }

    await axios.delete(`${ENDPOINT_URL}/cvs/${id}`);
    res.json({ message: "CV deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete CV" });
  }
});

module.exports = router;
