const mongoose = require('mongoose');

const AmbulanceSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  driverNumber: { type: String, required: true },
  district: { type: String, required: true, lowercase: true, trim: true },
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bookingTime: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Ambulance', AmbulanceSchema);

