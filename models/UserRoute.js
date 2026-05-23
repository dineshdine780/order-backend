const mongoose = require("mongoose");

const userRouteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      default: "Unknown",
    },
  },
  { timestamps: true }
);

userRouteSchema.index({ userId: 1 });
userRouteSchema.index({ createdAt: -1 });

module.exports = mongoose.model("UserRoute", userRouteSchema);