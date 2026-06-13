const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const MedicalItem = require('../models/MedicalItem');
const Order = require('../models/Order');

// 1. Get all available shop items for patients
router.get('/items', protect, async (req, res) => {
  try {
    const items = await MedicalItem.find({ status: 'available' });
    res.json(items);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 2. Patient clicks "Book" to purchase item
router.post('/book-item/:itemId', protect, async (req, res) => {
  try {
    const item = await MedicalItem.findById(req.params.itemId);
    if (!item || item.status === 'sold') return res.status(400).json({ msg: "Item unavailable" });

    // Create new order tracking item
    const newOrder = new Order({
      patientId: req.user.id,
      itemId: item._id,
      status: 'booked'
    });

    await newOrder.save();
    res.status(201).json({ msg: "Item booked! Awaiting admin notification to proceed.", order: newOrder });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 3. Patient submits their payment transaction number
router.put('/submit-transaction/:orderId', protect, async (req, res) => {
  try {
    const { transactionNumber } = req.body;
    if (!transactionNumber) return res.status(400).json({ msg: "Transaction number required" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ msg: "Order tracking record missing" });
    
    order.transactionNumber = transactionNumber;
    order.status = 'verifying';
    await order.save();

    res.json({ msg: "Transaction number uploaded. Awaiting admin validation.", order });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
