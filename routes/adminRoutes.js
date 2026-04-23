const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Shop = require("../models/Shop");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 
const Order = require("../models/Order");


router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Not an admin" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.log("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});



router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/shops", async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });

    res.json(shops);

  } catch (err) {
    console.error("GET SHOPS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


router.delete("/shops/:id", async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ message: "Shop deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("shopId", "shopName")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


router.get("/api/orders/:shopId", async (req, res) => {
  try {
    const orders = await Order.find({
      shopId: req.params.shopId,
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;