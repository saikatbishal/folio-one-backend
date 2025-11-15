const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  message: { type: String, required: true },
  bio: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true }
});

module.exports = mongoose.model('Founder', founderSchema);