const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Only Admin can create a Doctor
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

// ADD THIS NEW ROUTE: Get single doctor by ID
router.get('/doctor/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor) return res.status(404).json({ msg: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
// URL: GET http://localhost:5000/api/admin/doctors
// This lets anyone (or just Admin/Users) see the list of doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password'); 
    // .select('-password') hides the password for security!
    res.json(doctors);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;