const express = require("express");
const router = express.Router();
const multer = require("multer");
const Shop = require("../models/Shop");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


router.post("/", upload.single("photo"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { shopName, ownerName, phone, latitude, longitude, locationName  } = req.body;

    if (!shopName || !ownerName || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newShop = new Shop({
  shopName,
  ownerName,
  phone,
  photo: req.file ? req.file.path : "",
  location: {
    latitude,
    longitude,
    address: locationName, 
  },
    });

    await newShop.save();

    res.status(201).json({ message: "Shop saved successfully" });

  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;