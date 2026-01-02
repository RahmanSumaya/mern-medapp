const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // e.g., "2026-05-20"
  time: { type: String, required: true }, // e.g., "10:30 AM"
  status: { 
    type: String, 
    enum: ['Pending', 'DoctorApproved', 'Paid', 'Confirmed', 'Cancelled'], 
    default: 'Pending' 
  },
  paymentDetails: {
    transactionId: String,
    isPaid: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);