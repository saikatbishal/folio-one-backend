const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Central list of allowed origins (frontend URLs)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://folio-one-brown.vercel.app",
  "https://folio-qp1qaihop-saikatbishals-projects.vercel.app",
  "https://folio-one-saikatbishals-projects.vercel.app",
  "https://folio-one-git-master-saikatbishals-projects.vercel.app",
  "https://folio-oqpsdkssg-saikatbishals-projects.vercel.app",
];

// CORS options that are safe for credentials
const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin or non-browser requests (no Origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

// Apply CORS and JSON/cookie middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight uses same options
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/founders", require("./routes/founders"));

app.get("/", (req, res) => {
  res.send("Folio Backend API Running");
});

// Simple health check endpoint (no mongoose access)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Local development server (Vercel ignores this block)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Local server running at http://localhost:${PORT}`);
  });
}

module.exports = app;