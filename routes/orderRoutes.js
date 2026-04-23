const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Item = require("../models/Item");
const Payment = require("../models/Payment");


router.post("/", async (req, res) => {
  try {
    const { shopId, items, totalAmount, paymentMethod, creditAmount, paidAmount } = req.body;

    if (!shopId || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

   
    for (let i of items) {
      const item = await Item.findOne({ name: i.name });

      if (!item || item.actualQuantity < i.qty) {
        return res.status(400).json({
          message: `${i.name} is out of stock`,
        });
      }
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const finalTotalAmount = Number(totalAmount || 0);

   const finalPaidAmount = Number(paidAmount || 0);

const balanceAmount = finalTotalAmount - finalPaidAmount;

   

    const order = new Order({
  orderId,
  shopId,
  items,
  totalAmount: finalTotalAmount,
  paymentMethod,
  paidAmount: finalPaidAmount,
  balanceAmount,
});

    await order.save();

    await Payment.create({
      shopId,
      order: order._id,
      orderId,
      totalAmount: finalTotalAmount,
      paidAmount: finalPaidAmount,
      balance: balanceAmount,
      status: balanceAmount > 0 ? "Pending" : "Completed",
    });

    
    await Promise.all(
      items.map(i =>
        Item.findOneAndUpdate(
          { name: i.name },
          { $inc: { actualQuantity: -i.qty } }
        )
      )
    );

    res.json({ message: "Order created", order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("shopId");

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:shopId", async (req, res) => {
  try {
    const orders = await Order.find({
      shopId: req.params.shopId,
    })
      .populate("shopId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("shopId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;