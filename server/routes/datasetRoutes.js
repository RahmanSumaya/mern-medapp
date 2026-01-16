const express = require('express');
const multer = require('multer');
const Dataset = require('../models/XYZ'); // Ensure this matches your file name (Dataset.js)
const path = require('path');
const router = express.Router();
const { uploadDataset } = require('../controllers/datasetController');
const { protect, authorize } = require('../middleware/authMiddleware');

// 1. Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// 2. Multer Configuration with 10MB Limit
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB in bytes
});

// 3. Helper to handle Multer errors (like file size)
const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ msg: "File is too large. Max limit is 10MB." });
      }
      return res.status(400).json({ msg: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ msg: "Unknown upload error." });
    }
    next();
  });
};

// --- ROUTES ---

// Upload Dataset (Uses the error handler)
router.post('/upload', protect, authorize('doctor'), uploadMiddleware, uploadDataset);

// Get doctor's own uploads
router.get('/doctor/my-uploads', protect, authorize('doctor'), async (req, res) => {
  try {
    // This is where the 500 error happens if 'Dataset' isn't defined
    const datasets = await Dataset.find({ doctor: req.user.id }).sort({ createdAt: -1 });
    res.json(datasets);
  } catch (err) {
    console.error("Backend Error:", err.message); // This will show in your VS Code terminal
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    // This will now look into the 'users' collection for the ID stored in 'doctor'
    const datasets = await Dataset.find().populate('doctor', 'name specialization');
    res.json(datasets);
  } catch (err) {
    console.error("ADMIN FETCH ERROR:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});
// server/routes/datasetRoutes.js

// @route   GET /api/datasets
// @desc    Get all APPROVED datasets for the public library
router.get('/public_dataset', async (req, res) => {
  try {
    // We only want to show datasets that the admin has approved
    const datasets = await Dataset.find({ status: 'Approved' }).populate('doctor', 'name specialization');
    res.json(datasets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// APPROVE DATASET
router.put('/approve/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const dataset = await Dataset.findByIdAndUpdate(
      req.params.id, 
      { status: 'Approved' }, 
      { new: true }
    );
    res.json(dataset);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;