const express = require("express");
const router = express.Router();
const Item = require("../models/Item");





// ADD ITEM
router.post("/", async (req, res) => {
  try {

    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      sellingPrice: req.body.sellingPrice,
      sellingUnit: req.body.sellingUnit,
      minQuantity: req.body.minQuantity,
      actualQuantity: req.body.actualQuantity,
      image: req.body.image,
    });

    await item.save();

    res.json({
      message: "Item added",
      item,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET ITEMS
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// UPDATE ITEM
router.put("/:id", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// DELETE ITEM
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);

    res.json({
      message: "Item deleted"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






module.exports = router;