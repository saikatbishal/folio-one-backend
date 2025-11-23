const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CORS config
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://folio-one-brown.vercel.app",
  "https://folio-qp1qaihop-saikatbishals-projects.vercel.app",
  "https://folio-one-saikatbishals-projects.vercel.app",
  "https://folio-one-git-master-saikatbishals-projects.vercel.app",
  "https://folio-oqpsdkssg-saikatbishals-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

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

// MongoDB connection with caching for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || "userData",
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Atlas Connected");
  } catch (err) {
    console.log("DB Error:", err);
    throw err;
  }
};

// Connect to DB
connectDB();

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// ----------------------------------------
// LOCAL DEVELOPMENT ONLY
// Run server locally (not on Vercel)
// ----------------------------------------
if (process.env.NODE_ENV !== "production") {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Local server running at http://localhost:${PORT}`);
  });
}

// ----------------------------------------
// Vercel serverless export
// ----------------------------------------
module.exports = app;
