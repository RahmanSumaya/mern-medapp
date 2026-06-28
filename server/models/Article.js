const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  diseaseName: { type: String, required: true},
  content: { type: String, required: true }, 
  symptoms: { type: String },
  prevention: { type: String },
  category: { type: String }, 
  imageUrl: { type: String }, 
  source: { type: String, default: 'WHO / CDC' }, 
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);