const express = require("express");
const router = express.Router();

const UserRoute = require("../models/UserRoute");



router.post("/save", async (req, res) => {
  try {
    const { userId, latitude, longitude, address } = req.body;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newRoute = new UserRoute({
      userId,
      latitude: Number(latitude),
      longitude: Number(longitude),
      address: address || "Unknown",
    });

    await newRoute.save();

    res.json({ message: "Route saved successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/admin/route/:userId", async (req, res) => {
  try {
    const routes = await UserRoute.find({
      userId: req.params.userId,
    });

    res.json(routes);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/admin/routes/all", async (req, res) => {
  try {
    const routes = await UserRoute.find();

    res.json(routes);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;