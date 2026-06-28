const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => { 
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({
      name,
      email,
      password, 
      role: 'user' 
    });

    await user.save();
    return res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

// 2. LOGIN
exports.login = async (req, res) => { 
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

exports.getMe = async (req, res) => { 
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: "Not authorized" });
    }
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { 
      name, phone, address, gender, dob, profilePic, 
      specialization, hourlyRate, experience, hospitalName, about, education 
    } = req.body;

    const updateData = { 
      name, phone, address, gender, dob, profilePic, 
      specialization, hourlyRate, experience, hospitalName, about, education 
    };

    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id).select('-password');
    if (!doctor) return res.status(404).json({ msg: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).send('Server Error in getDoctorProfile');
  }
};