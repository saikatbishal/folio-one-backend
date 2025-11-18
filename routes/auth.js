const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateTokens');
// Register
router.post('/register', async (req, res) => {
  const { username, name, email, password, usertype = 'user' } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username, name, email, password: hashedPassword, usertype
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      usertype: user.usertype,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.cookie('jwt', generateToken(user._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      _id: user._id,
      username: user.username,
      usertype: user.usertype
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out' });
});

module.exports = router;