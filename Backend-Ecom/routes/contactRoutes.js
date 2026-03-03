// backend/routes/contactRoutes.js
const express = require("express");
const router  = express.Router();
const ContactMessage = require("../models/ContactMessage");

// POST — user submits contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ message: "Name, email and message are required" });
    const msg = await ContactMessage.create({ name, email, phone, message, userNotified: true });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET all messages — dealer view (excludes dealer-hidden ones)
router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find({ dealerHidden: { $ne: true } }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET messages by user email  ← must be before /:id routes
router.get("/user/:email", async (req, res) => {
  try {
    const messages = await ContactMessage.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH — dealer updates status → userNotified=false triggers user popup
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status, userNotified: false },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH — mark dealer notification as seen
router.patch("/:id/notified", async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { notified: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH — mark user notification as seen
router.patch("/:id/userNotified", async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { userNotified: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH — dealer hides a query (✕ click) — stays in DB, hidden from list
router.patch("/:id/dealerHidden", async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { dealerHidden: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;