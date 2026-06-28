const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/authMiddleware');
const MedicalRecord = require('../models/MedicalRecord');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/records/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/upload', protect, upload.single('medicalFile'), async (req, res) => {
  try {
    const newRecord = new MedicalRecord({
      patient: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      description: req.body.description
    });
    await newRecord.save();
    res.json({ msg: "File uploaded successfully" });
  } catch (err) { res.status(500).send("Upload Error"); }
});

router.get('/my-records', protect, async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.user.id });
  res.json(records);
});

router.get('/patient/:patientId', protect, authorize('doctor'), async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.params.patientId });
  res.json(records);
});

module.exports = router;