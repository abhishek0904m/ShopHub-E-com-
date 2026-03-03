// routes/dealerRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Dealer = require("../models/Dealer");

// Generate unique dealer code
const generateDealerCode = () => {
  const prefix = "DLR";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// ── DEALER REGISTRATION ──
router.post("/register", async (req, res) => {
  const { name, email, password, businessName, phone, address, gst } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  try {
    // Check if dealer already exists
    const existing = await Dealer.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Generate unique dealer code
    let dealerCode;
    let isUnique = false;
    while (!isUnique) {
      dealerCode = generateDealerCode();
      const existingCode = await Dealer.findOne({ dealerCode });
      if (!existingCode) isUnique = true;
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create dealer
    const dealer = await Dealer.create({
      name,
      email,
      password: hashed,
      dealerCode,
      businessName: businessName || "",
      phone: phone || "",
      address: address || "",
      gst: gst || "",
      isApproved: true, // Auto-approve for now (can be changed to require admin approval)
    });

    res.status(201).json({
      message: "Dealer registered successfully",
      dealerId: dealer._id,
      dealerCode: dealer.dealerCode,
      name: dealer.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DEALER LOGIN ──
router.post("/login", async (req, res) => {
  const { email, password, dealerCode } = req.body;

  if (!email || !password || !dealerCode) {
    return res.status(400).json({ message: "Email, password, and dealer code are required" });
  }

  try {
    const dealer = await Dealer.findOne({ email });
    if (!dealer) {
      return res.status(404).json({ message: "No dealer account found with this email" });
    }

    // ✅ Verify dealer code matches
    if (dealer.dealerCode !== dealerCode) {
      return res.status(401).json({ message: "Invalid dealer code" });
    }

    if (!dealer.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated" });
    }

    if (!dealer.isApproved) {
      return res.status(403).json({ message: "Your account is pending admin approval" });
    }

    const isMatch = await bcrypt.compare(password, dealer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      dealerId: dealer._id,
      dealerCode: dealer.dealerCode,
      name: dealer.name,
      businessName: dealer.businessName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET DEALER PROFILE ──
router.get("/profile/:dealerId", async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.dealerId).select("-password");
    if (!dealer) return res.status(404).json({ message: "Dealer not found" });
    res.json(dealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── UPDATE DEALER PROFILE ──
router.patch("/profile/:dealerId", async (req, res) => {
  const { name, businessName, phone, address, gst } = req.body;
  try {
    const dealer = await Dealer.findByIdAndUpdate(
      req.params.dealerId,
      { name, businessName, phone, address, gst },
      { new: true }
    ).select("-password");
    
    if (!dealer) return res.status(404).json({ message: "Dealer not found" });
    res.json({ message: "Profile updated", dealer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET ALL DEALERS (Admin only) ──
router.get("/all", async (req, res) => {
  try {
    const dealers = await Dealer.find().select("-password").sort({ createdAt: -1 });
    res.json(dealers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── APPROVE/REJECT DEALER (Admin only) ──
router.patch("/:dealerId/approval", async (req, res) => {
  const { isApproved } = req.body;
  try {
    const dealer = await Dealer.findByIdAndUpdate(
      req.params.dealerId,
      { isApproved },
      { new: true }
    ).select("-password");
    
    if (!dealer) return res.status(404).json({ message: "Dealer not found" });
    res.json({ message: `Dealer ${isApproved ? "approved" : "rejected"}`, dealer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── ACTIVATE/DEACTIVATE DEALER (Admin only) ──
router.patch("/:dealerId/status", async (req, res) => {
  const { isActive } = req.body;
  try {
    const dealer = await Dealer.findByIdAndUpdate(
      req.params.dealerId,
      { isActive },
      { new: true }
    ).select("-password");
    
    if (!dealer) return res.status(404).json({ message: "Dealer not found" });
    res.json({ message: `Dealer ${isActive ? "activated" : "deactivated"}`, dealer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
