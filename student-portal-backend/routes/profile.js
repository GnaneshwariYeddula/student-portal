const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Profile = require("../models/profile");

// GET current profile
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile", error: err.message });
  }
});

// PUT update or create
router.put("/", auth, async (req, res) => {
  try {
    const payload = { ...req.body, user: req.userId };
    const profile = await Profile.findOneAndUpdate({ user: req.userId }, payload, { new: true, upsert: true });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

module.exports = router;
