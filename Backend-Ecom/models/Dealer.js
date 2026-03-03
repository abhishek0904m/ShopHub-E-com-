// models/Dealer.js
const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true },
  dealerCode:   { type: String, required: true, unique: true }, // Auto-generated unique code
  businessName: { type: String, default: "" },
  phone:        { type: String, default: "" },
  address:      { type: String, default: "" },
  gst:          { type: String, default: "" },
  isApproved:   { type: Boolean, default: false }, // Admin approval required
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Dealer", dealerSchema);
