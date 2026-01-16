const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Pending' }, // Pending, Approved
  downloadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dataset', datasetSchema);