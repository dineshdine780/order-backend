const express = require("express");
const router = express.Router();
const Order = require("../models/Order");



router.post("/", async (req, res) => {
  try {
    const { shopId, items, totalAmount } = req.body;

    const order = new Order({
      shopId,
      items,
      totalAmount,
    });

    await order.save();

    res.json({ message: "Order created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/:shopId", async (req, res) => {
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