// models/Order.js
const mongoose = require("mongoose");

// ── Each item in the order ──
const orderItemSchema = new mongoose.Schema({
  productId: { type: String, default: "" },
  name:      { type: String, required: true },
  price:     { type: String, default: "" },      // display string e.g. "₹1,299"
  rawPrice:  { type: Number, required: true },   // numeric for calculations
  img:       { type: String, default: "" },
  off:       { type: String, default: "" },
  qty:       { type: Number, required: true, min: 1 },
  dealerId:  { type: mongoose.Schema.Types.ObjectId, ref: "Dealer" }, // ✅ Link to dealer
  dealerCode:{ type: String, default: "" }, // ✅ For quick filtering
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id:           { type: String, required: true },        // e.g. #ORD-1234
  item:         { type: String, required: true },        // summary e.g. "Nike Shoes + 2 more"
  date:         { type: String, required: true },        // formatted date string
  status:       { type: String, default: "In Transit" }, // Delivered | In Transit | Cancelled
  amt:          { type: String, required: true },        // e.g. ₹1,299
  icon:         { type: String, default: "🛍️" },
  paymentId:    { type: String, default: "" },           // Razorpay payment ID or "COD"
  userName:     { type: String, required: true },        // links order to logged-in user (email)
  items:        { type: [orderItemSchema], default: [] },// ✅ full item breakdown
  shipping:     {                                        // ✅ saved shipping address
    fullName: { type: String, default: "" },
    mobile:   { type: String, default: "" },
    address:  { type: String, default: "" },
    city:     { type: String, default: "" },
    state:    { type: String, default: "" },
    pincode:  { type: String, default: "" },
  },
  cancelReason: { type: String, default: "" },           // reason when dealer cancels
  cancelledBy:  { type: String, default: "" },           // "dealer" | "user"
  notified:     { type: Boolean, default: false },       // has user seen the cancel notification?
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);