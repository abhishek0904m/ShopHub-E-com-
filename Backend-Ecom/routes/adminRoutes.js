// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Dealer = require("../models/Dealer");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ── ADMIN LOGIN ──
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      name: admin.name,
      adminId: admin._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── CREATE ADMIN (First time setup or by existing admin) ──
router.post("/create", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });

    res.status(201).json({
      message: "Admin created successfully",
      adminId: admin._id,
      name: admin.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET DASHBOARD STATS ──
router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const dealers = await Dealer.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();

    // Calculate total revenue
    const allOrders = await Order.find();
    const revenue = allOrders.reduce((sum, order) => {
      const amount = parseInt(order.amt.replace(/[^0-9]/g, "")) || 0;
      return sum + amount;
    }, 0);

    res.json({
      users,
      dealers,
      products,
      orders,
      revenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET ALL USERS ──
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET ALL DEALERS ──
router.get("/dealers", async (req, res) => {
  try {
    const dealers = await Dealer.find().select("-password").sort({ createdAt: -1 });
    res.json(dealers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET ALL PRODUCTS ──
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("dealerId", "name businessName dealerCode").sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET ALL ORDERS ──
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE USER ──
router.delete("/users/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE DEALER ──
router.delete("/dealers/:dealerId", async (req, res) => {
  try {
    const dealer = await Dealer.findByIdAndDelete(req.params.dealerId);
    if (!dealer) return res.status(404).json({ message: "Dealer not found" });
    
    // Optionally delete all products by this dealer
    await Product.deleteMany({ dealerId: req.params.dealerId });
    
    res.json({ message: "Dealer and their products deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE PRODUCT ──
router.delete("/products/:productId", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
