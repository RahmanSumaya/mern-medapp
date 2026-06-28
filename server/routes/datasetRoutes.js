const express = require('express');
const multer = require('multer');
const Dataset = require('../models/XYZ'); 
const path = require('path');
const router = express.Router();
const { uploadDataset } = require('../controllers/datasetController');
const { protect, authorize } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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


// Run uploadMiddleware FIRST so Multer can cleanly parse the incoming stream
router.post(
  '/upload', 
  protect, 
  authorize('doctor'), 
  upload.single('file'), 
  uploadDataset
);

router.get('/doctor/my-uploads', protect, authorize('doctor'), async (req, res) => {
  try {
    const datasets = await Dataset.find({ doctor: req.user.id }).sort({ createdAt: -1 });
    res.json(datasets);
  } catch (err) {
    console.error("Backend Error:", err.message); 
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const datasets = await Dataset.find().populate('doctor', 'name specialization');
    res.json(datasets);
  } catch (err) {
    console.error("ADMIN FETCH ERROR:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

router.get('/public_dataset', async (req, res) => {
  try {
    const datasets = await Dataset.find({ status: 'Approved' }).populate('doctor', 'name specialization');
    res.json(datasets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
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