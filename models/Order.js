const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    items: [
      {
        name: String,
        qty: Number,
        price: Number,
      },
    ],
    totalAmount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);