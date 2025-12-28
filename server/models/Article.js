const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  diseaseName: { type: String, required: true},
  content: { type: String, required: true }, // The detailed info
  symptoms: { type: String },
  prevention: { type: String },
  category: { type: String }, // e.g., Viral, Chronic, Mental Health
  imageUrl: { type: String }, // Link to the picture
  source: { type: String, default: 'WHO / CDC' }, // Credibility
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The Admin who posted it
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);