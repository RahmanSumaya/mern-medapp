const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/users/profile
router.get('/profile', protect, async (req, res) => {
  try {
    // Check if req.user exists from the protect middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "User ID missing from token" });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });
    
    return res.json(user);
  } catch (err) {
    console.error("Profile GET Error:", err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address, profilePic, specialization, hourlyRate } = req.body;

    const profileFields = {};
    if (name) profileFields.name = name;
    if (phone) profileFields.phone = phone;
    if (address) profileFields.address = address;
    if (profilePic) profileFields.profilePic = profilePic;
    if (specialization) profileFields.specialization = specialization;
    if (hourlyRate) profileFields.hourlyRate = hourlyRate;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("Profile PUT Error:", err.message);
    return res.status(500).send('userroutes error');
  }
});

module.exports = router;