const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const products = [
  // ── Mobiles ──
  {
    name: "Samsung Galaxy S24",
    description: "Latest Samsung flagship with 200MP camera and AI features.",
    price: 74999, originalPrice: 89999, discount: 17,
    rating: 4.6, reviewCount: 15230,
    category: "Mobiles", badge: "BESTSELLER",
    image: "📱", stock: 50,
  },
  {
    name: "Redmi Note 13 Pro",
    description: "Best budget smartphone with AMOLED display.",
    price: 24999, originalPrice: 29999, discount: 17,
    rating: 4.4, reviewCount: 9870,
    category: "Mobiles", badge: "TRENDING",
    image: "📱", stock: 120,
  },

  // ── Electronics ──
  {
    name: "Smart Watch Series 9",
    description: "Track fitness, sleep, and health with precision.",
    price: 3999, originalPrice: 4999, discount: 20,
    rating: 4.5, reviewCount: 12490,
    category: "Electronics", badge: "BESTSELLER",
    image: "⌚", stock: 80,
  },
  {
    name: "JBL Bluetooth Speaker",
    description: "360° surround sound with 12hr battery life.",
    price: 1799, originalPrice: 2099, discount: 15,
    rating: 4.3, reviewCount: 8231,
    category: "Electronics", badge: "TRENDING",
    image: "🔊", stock: 60,
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Premium ANC headphones with 30hr playback.",
    price: 2499, originalPrice: 3299, discount: 24,
    rating: 4.6, reviewCount: 9120,
    category: "Electronics", badge: "TOP RATED",
    image: "🎧", stock: 45,
  },
  {
    name: "USB-C Charging Hub",
    description: "7-in-1 USB hub with 4K HDMI and 100W PD.",
    price: 849, originalPrice: 1199, discount: 29,
    rating: 4.2, reviewCount: 6540,
    category: "Electronics", badge: "HOT DEAL",
    image: "🔌", stock: 200,
  },
  {
    name: "Gaming Mouse",
    description: "Lightweight gaming mouse with 25K DPI sensor.",
    price: 1299, originalPrice: 1799, discount: 28,
    rating: 4.5, reviewCount: 7891,
    category: "Electronics", badge: "HOT DEAL",
    image: "🖱️", stock: 90,
  },

  // ── Fashion ──
  {
    name: "Polarized Sunglasses",
    description: "UV400 protection with stylish frame.",
    price: 599, originalPrice: 849, discount: 29,
    rating: 4.0, reviewCount: 5871,
    category: "Fashion", badge: "HOT DEAL",
    image: "🕶️", stock: 150,
  },
  {
    name: "Running Shoes Pro",
    description: "Lightweight and breathable with extra cushioning.",
    price: 1999, originalPrice: 2799, discount: 29,
    rating: 4.4, reviewCount: 4320,
    category: "Sports", badge: "TRENDING",
    image: "👟", stock: 75,
  },

  // ── Home ──
  {
    name: "Leather Laptop Bag",
    description: "Fits up to 15.6\" laptops with multiple pockets.",
    price: 999, originalPrice: 1099, discount: 9,
    rating: 4.1, reviewCount: 3442,
    category: "Home", badge: "HOT DEAL",
    image: "💼", stock: 40,
  },

  // ── Kitchen ──
  {
    name: "Stainless Steel Water Bottle",
    description: "Keeps drinks cold 24hr and hot 12hr.",
    price: 499, originalPrice: 799, discount: 38,
    rating: 4.7, reviewCount: 22100,
    category: "Kitchen", badge: "BESTSELLER",
    image: "🍶", stock: 300,
  },

  // ── Books ──
  {
    name: "Atomic Habits",
    description: "Best-selling book on building good habits by James Clear.",
    price: 349, originalPrice: 499, discount: 30,
    rating: 4.9, reviewCount: 54000,
    category: "Books", badge: "BESTSELLER",
    image: "📚", stock: 500,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Product.deleteMany(); // clear old products
    await Product.insertMany(products);

    console.log(`✅ ${products.length} products inserted successfully!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
}

seedProducts();