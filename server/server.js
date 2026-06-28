const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // ADDED THIS
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json());


const recordsDir = path.join(__dirname, 'uploads', 'records');
if (!fs.existsSync(recordsDir)) {
    fs.mkdirSync(recordsDir, { recursive: true });
    console.log("Created directory:", recordsDir);
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const datasetRoutes = require('./routes/datasetRoutes');
const articleRoutes = require('./routes/articleRoutes');
const userRoutes = require('./routes/userRoutes'); 
const recordRoutes = require('./routes/recordRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.get('/', (req, res) => {
  res.send("API is running...");
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dataset', datasetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));