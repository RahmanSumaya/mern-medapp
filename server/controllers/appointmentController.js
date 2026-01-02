const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// 1. GET appointments for the logged-in PATIENT
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET appointments for the logged-in DOCTOR
const getDoctorRequests = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('user', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. ENHANCED Booking
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    // Check if req.user exists (from authMiddleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated correctly" });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: 'Confirmed'
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    // Explicitly create the object
    const newAppointment = new Appointment({
      user: req.user.id, // Ensure your Model uses 'user' and NOT 'patient'
      doctor: doctorId,
      date: date,
      time: time,
      status: 'Pending' // Explicitly set initial status
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json({ message: "Request sent!", newAppointment: savedAppointment });
  } catch (error) {
    console.error("Booking Error:", error); // Log this to your terminal to see the full error
    res.status(500).json({ message: error.message });
  }
};

// 4. Doctor Approves Request
const approveByDoctor = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.status = 'DoctorApproved';
    await appointment.save();
    res.json({ message: "Approved by doctor", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Admin Confirms Payment
const confirmByAdmin = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Confirmed',
        'paymentDetails.isPaid': true // FIX: This explicitly sets isPaid to true
      },
      { new: true } // This returns the updated document
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Confirmed by admin", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ensure ALL functions are exported
module.exports = { 
  bookAppointment, 
  getMyAppointments, 
  getDoctorRequests, 
  approveByDoctor, 
  confirmByAdmin 
};