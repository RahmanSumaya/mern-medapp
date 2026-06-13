const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalItem', required: true },
  status: { 
    type: String, 
    enum: ['booked', 'awaiting_payment', 'verifying', 'confirmed'], 
    default: 'booked' 
  },
  transactionNumber: { type: String, default: null },
  adminNotification: { type: Boolean, default: true } // True means admin sees a new notification alert
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
