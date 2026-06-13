const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Ambulance = require('../models/Ambulance');

// 1. Get available ambulances by district (for Patient profile display)
router.get('/district/:districtName', protect, async (req, res) => {
  try {
    const district = req.params.districtName.toLowerCase().trim();
    const ambulances = await Ambulance.find({ district, status: 'available' });
    res.json(ambulances);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 2. Patient books an emergency ambulance
router.post('/book/:id', protect, async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id);
    if (!ambulance) return res.status(404).json({ msg: "Ambulance service not found" });
    if (ambulance.status === 'booked') return res.status(400).json({ msg: "Ambulance is already booked" });

    ambulance.status = 'booked';
    ambulance.bookedBy = req.user.id; // From your auth token payload
    ambulance.bookingTime = new Date();
    
    await ambulance.save();
    res.json({ msg: "Ambulance booked successfully! The driver will contact you shortly.", ambulance });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
