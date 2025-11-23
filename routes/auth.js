const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateTokens");
const connectDB = require("../utils/dbConnect"); 

// Register
router.post("/register", async (req, res) => {
  try {
    await connectDB();

    const { username, name, email, password, usertype = "user" } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      usertype,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        usertype: user.usertype,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({
        message: "Server error during registration",
        error: error.message,
      });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // 1. ESTABLISH CONNECTION FIRST
    await connectDB();

    const { email, password } = req.body;
    
    // Now this query will wait for the connection above to complete
    const user = await User.findOne({ email });
    const isProd = process.env.NODE_ENV === "production";

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      res.cookie("jwt", generateToken(user._id), {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "strict" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: user._id,
        username: user.username,
        usertype: user.usertype,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
});

module.exports = router;