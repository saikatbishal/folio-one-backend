const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Get my profile (logged-in user)
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Get all users (admin only)
router.get('/', protect, admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Delete user (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.usertype === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });

  await user.deleteOne();
  res.json({ message: 'User removed' });
});

module.exports = router;