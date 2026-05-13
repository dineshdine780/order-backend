const express = require("express");
const router = express.Router();

const Purchase = require("../models/Purchase");
const Item = require("../models/Item");

router.post("/", async (req, res) => {

  try {

    const {
      itemName,
      quantity,
      price,
    } = req.body;

    const total =
      Number(quantity) *
      Number(price);

    const orderId =
      "PUR-" +
      Math.floor(
        100000 + Math.random() * 900000
      );

    const purchase =
      new Purchase({
        itemName,
        quantity,
        price,
        total,
        orderId,
        date: new Date()
          .toLocaleDateString(),
      });

    await purchase.save();

    // INCREASE STOCK

    await Item.findOneAndUpdate(
      { name: itemName },
      {
        $inc: {
          actualQuantity:
            Number(quantity),
        },
      }
    );

    res.json({
      message:
        "Purchase Added",
      purchase,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
});


// GET ALL PURCHASES

router.get("/", async (req, res) => {

  try {

    const purchases =
      await Purchase.find()
      .sort({ createdAt: -1 });

    res.json(purchases);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
});

module.exports = router;