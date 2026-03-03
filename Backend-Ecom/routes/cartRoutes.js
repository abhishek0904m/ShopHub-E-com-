const express = require("express");
const router  = express.Router();
const Cart    = require("../models/Cart");

// GET cart for a user
router.get("/:userEmail", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userEmail: req.params.userEmail });
    res.json(cart ? cart.items : []);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST — save entire cart (upsert)
router.post("/:userEmail", async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userEmail: req.params.userEmail },
      { items },
      { upsert: true, new: true }
    );
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE — clear entire cart
router.delete("/:userEmail", async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userEmail: req.params.userEmail },
      { items: [] }
    );
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;