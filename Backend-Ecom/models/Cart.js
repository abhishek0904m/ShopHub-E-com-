const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name:      { type: String, required: true },
  price:     { type: String },           // display string e.g. "₹1,299"
  rawPrice:  { type: Number, required: true },
  img:       { type: String, default: "" },
  off:       { type: String, default: "" },
  qty:       { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true, lowercase: true },
  items:     [cartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);