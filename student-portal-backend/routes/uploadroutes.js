// routes/uploadroutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const Profile = require("../models/profile");
const Certificate = require("../models/Certificate");

const router = express.Router();

// Setup multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

// -------------------- Upload Profile Photo --------------------
router.post("/profile-photo", auth, upload.single("photo"), async (req, res) => {
  try {
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    let profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      profile = new Profile({ user: req.userId, photoUrl: fileUrl });
    } else {
      profile.photoUrl = fileUrl;
    }

    await profile.save();
    res.json({ message: "Uploaded", fileUrl, profile });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// -------------------- Upload Certificate File --------------------
router.post("/certificate/:id", auth, upload.single("file"), async (req, res) => {
  try {
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const cert = await Certificate.findOne({ _id: req.params.id, user: req.userId });
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    cert.fileUrl = fileUrl;
    await cert.save();

    res.json({ message: "Uploaded", fileUrl, cert });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;
