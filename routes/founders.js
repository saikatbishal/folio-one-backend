const express = require("express");
const router = express.Router();
const Founder = require("../models/Founder");

// Get all founders (public)
router.get("/", async (req, res) => {
  try {
    const founders = await Founder.find();
    res.json(founders);
  } catch (error) {
    console.error("Get founders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add founder (you can protect this later)
router.post("/", async (req, res) => {
  try {
    const founder = new Founder(req.body);
    await founder.save();
    res.status(201).json(founder);
  } catch (error) {
    console.error("Add founder error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
