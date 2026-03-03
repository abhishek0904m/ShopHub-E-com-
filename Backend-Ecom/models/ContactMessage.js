// backend/models/ContactMessage.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, default: "" },
  message:      { type: String, required: true },
  status:       { type: String, default: "Open" }, // "Open" | "In Progress" | "Resolved"
  notified:     { type: Boolean, default: false }, // dealer has seen new message
  userNotified: { type: Boolean, default: true },  // user has seen status update
  dealerHidden: { type: Boolean, default: false }, // dealer clicked ✕ — hidden from list, kept in DB
}, { timestamps: true });

module.exports = mongoose.model("ContactMessage", contactSchema);