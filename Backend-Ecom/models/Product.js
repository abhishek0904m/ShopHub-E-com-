// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  rawPrice:    { type: Number, required: true },
  price:       { type: String },          // formatted: "₹29,999"
  mrp:         { type: String },          // formatted: "₹35,999"
  off:         { type: String },          // "17% off"
  brand:       { type: String, default: "" }, // brand name
  category:    { type: String, default: "General" },
  img:         { type: String, default: "" }, // ✅ primary image URL or base64
  images:      { type: [String], default: [] }, // ✅ array of additional images
  description: { type: String, default: "" }, // ✅ custom product description
  badge:       { type: String, default: "" },
  rat:         { type: String, default: "4.0" },
  rev:         { type: String, default: "100" },
  dealerId:    { type: mongoose.Schema.Types.ObjectId, ref: "Dealer", required: true }, // ✅ Link to dealer
  dealerCode:  { type: String, required: true }, // ✅ For quick filtering
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);