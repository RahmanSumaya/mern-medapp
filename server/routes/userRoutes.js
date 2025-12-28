const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/users/profile
// @desc    Get current logged-in user's profile (Works for both User & Doctor)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update profile (Name, Phone, Address, Profile Photo)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address, profilePic, specialization, hourlyRate } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (phone) profileFields.phone = phone;
    if (address) profileFields.address = address;
    if (profilePic) profileFields.profilePic = profilePic;
    
    // If the logged-in user is a doctor, they can also update these:
    if (specialization) profileFields.specialization = specialization;
    if (hourlyRate) profileFields.hourlyRate = hourlyRate;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;