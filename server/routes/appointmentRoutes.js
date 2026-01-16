const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getMyAppointments, 
  getDoctorRequests,
  approveByDoctor,
  confirmByAdmin,
  payAppointment,
  getAllAppointments
} = require('../controllers/appointmentController');

// FIX 1: Import BOTH protect and authorize
const { protect, authorize } = require('../middleware/authMiddleware');

// Booking and Fetching
router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments); // Added semicolon

// FIX 2: Added protect BEFORE authorize
router.get('/doctor-requests', protect, authorize('doctor'), getDoctorRequests);

// Workflow Status Updates
router.put('/approve/:id', protect, authorize('doctor'), approveByDoctor);
router.put('/admin-confirm/:id', protect, authorize('admin'), confirmByAdmin);
router.put('/pay/:id', protect, payAppointment);
module.exports = router;