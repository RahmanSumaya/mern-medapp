const express = require('express');
const router = express.Router();
const { signup, login, updateProfile, getMe, getDoctorProfile } = require('../controllers/authController');
const { protect,authorize } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);

router.get('/me', protect, getMe); 
router.put('/profile', protect, updateProfile); 
router.get('/doctor/dashboard', protect, authorize('doctor'), getDoctorProfile);
module.exports = router;