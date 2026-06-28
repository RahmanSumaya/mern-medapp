const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String }, 
  dob: { type: Date },      
  role: { 
    type: String, 
    enum: ['user', 'admin', 'doctor'], 
    default: 'user' 
  },
  specialization: { type: String }, 
  address: { type: String },
  phone: { type: String },
  hourlyRate: { type: Number },
  
  experience: { type: Number, default: 0 }, 
  hospitalName: { type: String },
  about: { type: String },
  education: { type: String },
  status: { 
    type: String, 
    enum: ['available', 'unavailable'], 
    default: 'available' 
  },
profilePic: { 
  type: String, 
  default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' 
},
  createdAt: { type: Date, default: Date.now }
});
UserSchema.methods.matchPassword = async function (enteredPassword) {
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