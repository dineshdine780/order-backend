const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  shopName: String,
  ownerName: String,
  phone: String,
  photo: String, 
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);