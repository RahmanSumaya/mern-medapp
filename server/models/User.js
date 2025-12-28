const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Or 'bcrypt' depending on what you installed

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String }, // Add this
  dob: { type: Date },      // Add this
  role: { 
    type: String, 
    enum: ['user', 'admin', 'doctor'], 
    default: 'user' 
  },
  // --- New Doctor Specific Fields ---
  specialization: { type: String }, // e.g., Neurologist
  address: { type: String },
  phone: { type: String },
  hourlyRate: { type: Number },
  status: { 
    type: String, 
    enum: ['available', 'unavailable'], 
    default: 'available' 
  },
  // Add this inside your UserSchema
profilePic: { 
  type: String, 
  default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' // Default avatar link
},
  createdAt: { type: Date, default: Date.now }
});
// Add this helper method to the Schema
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // this.password refers to the hashed password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
module.exports = mongoose.model('User', UserSchema);