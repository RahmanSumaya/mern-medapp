const mongoose = require('mongoose');

const MedicalItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['medicine', 'book', 'organ'], required: true },
  price: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['available', 'sold'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('MedicalItem', MedicalItemSchema);

