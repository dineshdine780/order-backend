const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");


router.post("/", async (req, res) => {
  try {
    const { shopId, orderId, totalAmount, paidAmount } = req.body;

    const balance = totalAmount - paidAmount;

    const payment = new Payment({
      shopId,
      orderId,
      totalAmount,
      paidAmount,
      balance,
      status: balance > 0 ? "Pending" : "Completed",
    });

    await payment.save();

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("shopId")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;