const express = require('express');
const router = express.Router();
const Founder = require('../models/Founder');

// Get all founders (public)
router.get('/', async (req, res) => {
  const founders = await Founder.find();
  res.json(founders);
});

// Add founder (you can protect this later)
router.post('/', async (req, res) => {
  const founder = new Founder(req.body);
  await founder.save();
  res.status(201).json(founder);
});

module.exports = router;