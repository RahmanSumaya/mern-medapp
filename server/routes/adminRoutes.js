const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Only Admin can create a Doctor
router.post('/add-doctor', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, specialization, address, phone, hourlyRate } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // REMOVE THE MANUAL BCRYPT HASHING HERE
    // The User model's .pre('save') handles it automatically!

    const doctor = new User({
      name,
      email,
      password, // Send plain password
      role: 'doctor',
      specialization,
      address,
      phone,
      hourlyRate,
      status: 'available'
    });

    await doctor.save();
    res.status(201).json({ msg: "Doctor created successfully", doctor });
  } catch (err) {
    console.error(err);
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