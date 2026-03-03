// routes/orderRoutes.js
const express = require("express");
const router  = express.Router();
const Order   = require("../models/Order");

// ── GET all orders (dealer view) ── MUST be before /:userName
router.get("/all", async (req, res) => {
  try {
    const { dealerId } = req.query;
    let orders;
    
    if (dealerId) {
      // ✅ Filter orders that contain items from this dealer
      orders = await Order.find({
        "items.dealerId": dealerId
      }).sort({ createdAt: -1 });
    } else {
      // Admin view - all orders
      orders = await Order.find().sort({ createdAt: -1 });
    }
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET orders by user ──
router.get("/:userName", async (req, res) => {
  try {
    const orders = await Order.find({ userName: req.params.userName }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST create order ──
router.post("/", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PATCH update order status ──
// ✅ Now saves cancelReason + cancelledBy when dealer cancels
router.patch("/:orderId/status", async (req, res) => {
  try {
    const { status, cancelReason, cancelledBy } = req.body;

    const updateFields = { status };
    if (cancelReason) updateFields.cancelReason = cancelReason;
    if (cancelledBy)  updateFields.cancelledBy  = cancelledBy;
    // ✅ Reset notified=false so user sees popup on next login
    if (status === "Cancelled") updateFields.notified = false;

    let order = await Order.findByIdAndUpdate(
      req.params.orderId,
      updateFields,
      { new: true }
    );
    if (!order) {
      order = await Order.findOneAndUpdate(
        { id: req.params.orderId },
        updateFields,
        { new: true }
      );
    }
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PATCH mark notification as seen ──
// ✅ Called when user dismisses the cancellation popup
router.patch("/:orderId/notified", async (req, res) => {
  try {
    let order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { notified: true },
      { new: true }
    );
    if (!order) {
      order = await Order.findOneAndUpdate(
        { id: req.params.orderId },
        { notified: true },
        { new: true }
      );
    }
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;