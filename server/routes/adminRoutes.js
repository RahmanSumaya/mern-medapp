const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/add-doctor', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, specialization, address, phone, hourlyRate, experience, hospitalName, about, education } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const doctor = new User({
      name, email, password, role: 'doctor',
      specialization, address, phone, hourlyRate,
      experience, hospitalName, about, education,
      status: 'available'
    });

    await doctor.save();
    res.status(201).json({ msg: "Doctor created successfully", doctor });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get('/doctor/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor) return res.status(404).json({ msg: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password'); 
    res.json(doctors);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
module.exports = router;