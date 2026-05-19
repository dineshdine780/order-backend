const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
    },
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

        delivered: {
      type: Boolean,
      default: false,
    },
      },
    ],
    subtotal: Number,

discount: {
  type: Number,
  default: 0,
},

totalAmount: Number,

    orderStatus: {
  type: String,
  enum: [
    "Pending",
    "Delivered",
    "Completed",
    "Cancelled",
  ],
  default: "Pending",
},
    
    paymentMethod: {
      type: String,
      enum: ["Cash", "Credit"],
      default: "Cash",
    },

     paidAmount: {
      type: Number,
      default: 0,
    },

    balanceAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);