const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. GLOBAL MIDDLEWARE FIRST
app.use(cors()); // Move this to the top
app.use(express.json());

// 2. STATUS ROUTE
app.get('/', (req, res) => {
  res.send("API is running...");
});

// 3. ROUTES SECOND
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));

// 4. DATABASE & START
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));