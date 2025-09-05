const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Certificate = require("../models/Certificate");

// GET all
router.get("/", auth, async (req, res) => {
  try {
    const list = await Certificate.find({ user: req.userId });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch certificates", error: err.message });
  }
});

// POST
router.post("/", auth, async (req, res) => {
  try {
    const { name, category, issuedBy, date } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const cert = new Certificate({ user: req.userId, name, category, issuedBy: issuedBy || "", date: date || null });
    await cert.save();
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: "Failed to add certificate", error: err.message });
  }
});

// PUT
router.put("/:id", auth, async (req, res) => {
  try {
    const cert = await Certificate.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true });
    if (!cert) return res.status(404).json({ message: "Certificate not found" });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: "Failed to update certificate", error: err.message });
  }
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    const cert = await Certificate.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!cert) return res.status(404).json({ message: "Certificate not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete certificate", error: err.message });
  }
});

module.exports = router;
