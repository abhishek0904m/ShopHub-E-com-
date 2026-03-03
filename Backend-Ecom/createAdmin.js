// createAdmin.js - Script to create the first admin account
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existing = await Admin.findOne({ email: "admin@shophub.in" });
    if (existing) {
      console.log("⚠ Admin already exists with email: admin@shophub.in");
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await Admin.create({
      name: "Admin",
      email: "admin@shophub.in",
      password: hashedPassword,
    });

    console.log("✅ Admin account created successfully!");
    console.log("📧 Email: admin@shophub.in");
    console.log("🔑 Password: admin123");
    console.log("\n⚠ IMPORTANT: Change this password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAdmin();
