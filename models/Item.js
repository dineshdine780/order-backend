const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
    name: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },

  sellingPrice: { 
    type: Number, 
    required: true 
},
  sellingUnit: { 
    type: String, 
    required: true 
},

  minQuantity: { 
    type: Number, 
    default: 0 
},
 actualQuantity: {
  type: Number,
  default: 0,
},

 image: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);