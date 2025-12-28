const express = require('express');
const router = express.Router();
// routes/authRoute.js
const { signup, login, updateProfile, getMe, getDoctorProfile } = require('../controllers/authController');

// Import the middleware
const { protect,authorize } = require('../middleware/authMiddleware');

// 1. Public Routes
router.post('/signup', signup);
router.post('/login', login);

// 2. Protected Routes (User must be logged in)
router.get('/me', protect, getMe); 
router.put('/profile', protect, updateProfile); 
// Add this line under your other protected routes
router.get('/doctor/dashboard', protect, authorize('doctor'), getDoctorProfile);
module.exports = router;