const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS – allow your frontend
app.use(cors({
  origin: [
    'http://localhost:5713',
    'folio-one-saikatbishals-projects.vercel.app',
    'folio-one-git-master-saikatbishals-projects.vercel.app',
    'folio-oqpsdkssg-saikatbishals-projects.vercel.app'

  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/founders', require('./routes/founders'));

app.get('/', (req, res) => {
  res.send('Folio Backend API Running');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch(err => console.log('DB Error:', err));

// Vercel expects module.exports for serverless
module.exports = app;