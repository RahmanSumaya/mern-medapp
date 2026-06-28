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

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/book', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments); 
router.get('/doctor-earnings', protect, async (req, res) => {
  try {
    const Appointment = require('../models/Appointment'); 
    
    const appointments = await Appointment.find({ 
      doctor: req.user.id, 
      status: { $in: ['Paid', 'Confirmed'] } 
    });

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
router.get('/doctor-requests', protect, authorize('doctor'), getDoctorRequests);
router.get('/all', protect, authorize('admin'), getAllAppointments);
router.put('/approve/:id', protect, authorize('doctor'), approveByDoctor);
router.put('/admin-confirm/:id', protect, authorize('admin'), confirmByAdmin);
router.put('/pay/:id', protect, payAppointment);
module.exports = router;