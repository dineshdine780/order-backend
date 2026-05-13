const mongoose = require("mongoose");

const purchaseSchema =
  new mongoose.Schema(
    {
      itemName: String,

      quantity: Number,

      price: Number,

      total: Number,

      orderId: String,

      date: String,
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Purchase",
    purchaseSchema
  );