const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const MedicalItem = require('../models/MedicalItem');
const Order = require('../models/Order');
const Ambulance = require('../models/Ambulance'); // Make sure the path to your models folder is correct
// A. Admin adds an item (Medicine/Book/Organ)
router.post('/add-shop-item', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, type, price, description } = req.body;
    const newItem = new MedicalItem({ name, type, price, description });
    await newItem.save();
    res.status(201).json({ msg: "Item added to inventory", item: newItem });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// B. Admin views all item booking notifications
router.get('/shop-orders', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('patientId', 'name email phone')
      .populate('itemId');
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// C. Admin requests patient to pay
router.put('/order/request-payment/:orderId', protect, authorize('admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = 'awaiting_payment';
    await order.save();
    res.json({ msg: "Payment request sent to the patient.", order });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// D. Admin verifies transaction and confirms the purchase
router.put('/order/confirm/:orderId', protect, authorize('admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (!order.transactionNumber) return res.status(400).json({ msg: "No transaction number provided yet" });

    order.status = 'confirmed';
    order.adminNotification = false; // clear notice
    await order.save();

    // Mark item as sold
    await MedicalItem.findByIdAndUpdate(order.itemId, { status: 'sold' });

    res.json({ msg: "Transaction verified successfully! Order is confirmed.", order });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});


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
// Admin adds an ambulance driver
router.post('/add-ambulance', protect, authorize('admin'), async (req, res) => {
  try {
    const { driverName, driverNumber, district } = req.body;
    
    if (!driverName || !driverNumber || !district) {
      return res.status(400).json({ msg: "Please fill out all fields" });
    }

    const newAmbulance = new Ambulance({ driverName, driverNumber, district });
    await newAmbulance.save();

    res.status(201).json({ msg: "Ambulance driver added successfully", ambulance: newAmbulance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;