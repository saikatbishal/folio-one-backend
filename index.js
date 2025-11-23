const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CORS config

app.use(

cors({

origin: [

"http://localhost:5173",

"https://folio-one-saikatbishals-projects.vercel.app",

"https://folio-one-git-master-saikatbishals-projects.vercel.app",

"https://folio-oqpsdkssg-saikatbishals-projects.vercel.app",

],

credentials: true,

})

);

  

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

// MongoDB connection

mongoose
.connect(process.env.MONGO_URI, {
dbName: process.env.MONGO_DB_NAME || "userData",})
.then(() => console.log("MongoDB Atlas Connected"))

.catch((err) => console.log("DB Error:", err));

  

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

module.exports = app;