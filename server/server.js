const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. GLOBAL MIDDLEWARE (Must be before routes)
app.use(cors()); 
app.use(express.json());

// 2. IMPORT ROUTERS
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes'); // Added this
// server.js
const chatRoutes = require('./routes/chatRoutes'); // 1. Import
// ... other imports


// 3. ROUTES
app.get('/', (req, res) => {
  res.send("API is running...");
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes); // Use the User routes here
app.use('/api/chat', chatRoutes);
//app.use('/api/chat', require('./routes/chatRoutes'));
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found on this server.` });
});
// 4. DATABASE & START
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));