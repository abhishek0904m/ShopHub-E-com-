const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ── GET all products (with optional filters) ──
router.get("/", async (req, res) => {
  try {
    const { category, badge, search, dealerCode } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (badge)    filter.badge = badge;
    if (search)   filter.name = { $regex: search, $options: "i" };
    // ✅ Filter by dealerCode if provided (for dealer dashboard)
    if (dealerCode) filter.dealerCode = dealerCode;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET single product ──
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST create product ──
router.post("/", async (req, res) => {
  try {
    const { name, rawPrice, category, img, images, description, badge, rat, rev, dealerId, dealerCode } = req.body;
    if (!name || !rawPrice) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const price = parseInt(rawPrice);
    const mrp   = Math.round(price * 1.2);
    const off   = Math.round(((mrp - price) / mrp) * 100);

    const product = await Product.create({
      name,
      rawPrice: price,
      price:    `₹${price.toLocaleString("en-IN")}`,
      mrp:      `₹${mrp.toLocaleString("en-IN")}`,
      off:      `${off}% off`,
      category: category || "General",
      img:      img || "",          // URL or base64 image
      images:   images || [],       // Array of additional images
      description: description || "", // Custom description
      badge:    badge || "",
      rat:      rat || "4.0",
      rev:      rev || "100",
      dealerId: dealerId || null,   // ✅ Store dealer ID
      dealerCode: dealerCode || null, // ✅ Store dealer code
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE product ── ✅ THIS WAS MISSING
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;