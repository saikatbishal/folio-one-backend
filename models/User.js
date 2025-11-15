const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  usertype: { type: String, enum: ['user', 'admin'], default: 'user' },
  userimage: { type: String },
  bio: { type: String },
  dateofjoining: { type: Date, default: Date.now },
  links: [{
    title: String,
    url: String
  }],
  color1: { type: String }, // hex
  color2: { type: String }  // hex
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);