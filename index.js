const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Standardize CORS origins in one place
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://folio-one-brown.vercel.app",
  "https://folio-qp1qaihop-saikatbishals-projects.vercel.app",
  "https://folio-one-saikatbishals-projects.vercel.app",
  "https://folio-one-git-master-saikatbishals-projects.vercel.app",
  "https://folio-oqpsdkssg-saikatbishals-projects.vercel.app",
];

// CORS configuration object
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests with the same CORS config
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Routes

app.use("/api/auth", require("./routes/auth"));

app.use("/api/users", require("./routes/users"));

app.use("/api/founders", require("./routes/founders"));

app.get("/", (req, res) => {
  res.send("Folio Backend API Running");
});

// Quick DB status endpoint (returns mongoose connection state)

app.get("/api/dbstatus", (req, res) => {
  const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  res.json({ state, status: states[state] || "unknown" });
});

// MongoDB connection is handled in routes via connectDB() utility
// Removed global mongoose.connect() to prevent buffering timeout in serverless

if (process.env.NODE_ENV !== "production") {
  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`Local server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
