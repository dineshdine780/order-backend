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
  minOrderQuantity: { 
    type: Number, 
    default: 0 
},

}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);