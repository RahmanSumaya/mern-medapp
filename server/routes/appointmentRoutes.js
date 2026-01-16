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
// GET api/appointments/doctor-earnings
router.get('/doctor-earnings', protect, async (req, res) => {
  try {
    const Appointment = require('../models/Appointment'); // Ensure path is correct
    
    // Find all paid/confirmed appointments for this doctor
    const appointments = await Appointment.find({ 
      doctor: req.user.id, 
      status: { $in: ['Paid', 'Confirmed'] } 
    });

    // Calculate total: count * doctor's hourly rate
    // If you store price in the appointment, use that instead.
    const user = await User.findById(req.user.id);
    const totalEarnings = appointments.length * (user.hourlyRate || 0);

    res.json({
      totalAppointments: appointments.length,
      totalEarnings: totalEarnings
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
// FIX 2: Added protect BEFORE authorize
router.get('/doctor-requests', protect, authorize('doctor'), getDoctorRequests);
router.get('/all', protect, authorize('admin'), getAllAppointments);
// Workflow Status Updates
router.put('/approve/:id', protect, authorize('doctor'), approveByDoctor);
router.put('/admin-confirm/:id', protect, authorize('admin'), confirmByAdmin);
router.put('/pay/:id', protect, payAppointment);
module.exports = router;