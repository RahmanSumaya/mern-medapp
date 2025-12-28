const express = require('express');
const router = express.Router();

// Import the controllers
const { signup, login, updateProfile, getMe } = require('../controllers/authController');

// Import the middleware
const { protect } = require('../middleware/authMiddleware');

// 1. Public Routes
router.post('/signup', signup);
router.post('/login', login);

// 2. Protected Routes (User must be logged in)
router.get('/me', protect, getMe); 
router.put('/profile', protect, updateProfile); 

module.exports = router;