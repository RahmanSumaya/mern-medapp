import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Check, X, Clock, Stethoscope } from 'lucide-react';
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    DoctorApproved: "bg-blue-100 text-blue-700 border-blue-200",
    Paid: "bg-purple-100 text-purple-700 border-purple-200",
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

// Usage in your list:
// <td><StatusBadge status={app.status} /></td>
const PatientDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // --- NEW STATES FOR APPOINTMENTS ---
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bookingData, setBookingData] = useState({ doctorId: '', date: '', time: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Profile
        const profileRes = await axios.get('http://localhost:5000/api/auth/me', { headers });
        setUserData(profileRes.data);
        setFormData(profileRes.data);

        // Fetch List of Doctors
        const doctorsRes = await axios.get('http://localhost:5000/api/users/doctors', { headers });
        setDoctors(doctorsRes.data);

        // Fetch Patient's Appointments
        const appointmentsRes = await axios.get('http://localhost:5000/api/appointments/my-appointments', { headers });
        setAppointments(appointmentsRes.data);

      } catch (err) {
        console.error("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data);
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err) {
      alert("Update failed");
    }
  };

  // --- NEW HANDLER: BOOK APPOINTMENT ---
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/appointments/book', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Appointment Requested!");
      setAppointments([...appointments, res.data.newAppointment]);
      setBookingData({ doctorId: '', date: '', time: '' }); // Reset form
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 space-y-10">
      
      {/* SECTION 1: PROFILE CARD */}
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-lg">
              <div className="w-full h-full bg-slate-100 rounded-[1.25rem] flex items-center justify-center text-blue-600">
                <User size={40} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{userData?.name}</h1>
              <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">{userData?.role}</p>
            </div>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition">
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-red-500 transition"><X /></button>
                <button onClick={handleUpdate} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition">
                  <Check size={16} /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
              {isEditing ? (
                <input className="w-full p-3 bg-slate-50 border rounded-xl outline-none" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              ) : (
                <div className="flex items-center gap-3 text-slate-700 font-medium p-1"><Phone size={18} className="text-slate-400" /> {userData?.phone || 'Not set'}</div>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Address</label>
              {isEditing ? (
                <input className="w-full p-3 bg-slate-50 border rounded-xl outline-none" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              ) : (
                <div className="flex items-center gap-3 text-slate-700 font-medium p-1"><MapPin size={18} className="text-slate-400" /> {userData?.address || 'Not set'}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: BOOKING FORM & HISTORY */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Book Appointment Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} /> Book New
          </h2>
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Select Doctor</label>
              <select 
                required
                className="w-full p-3 bg-slate-50 border rounded-xl outline-none mt-1"
                value={bookingData.doctorId}
                onChange={(e) => setBookingData({...bookingData, doctorId: e.target.value})}
              >
                <option value="">Choose a Doctor</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc._id}>{doc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
              <input 
                type="date" required className="w-full p-3 bg-slate-50 border rounded-xl outline-none mt-1"
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Time</label>
              <input 
                type="time" required className="w-full p-3 bg-slate-50 border rounded-xl outline-none mt-1"
                value={bookingData.time}
                onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Request Appointment
            </button>
          </form>
        </div>

        {/* Appointment History List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Your Appointments</h2>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-slate-400 text-sm">No appointments found.</p>
            ) : (
              appointments.map((app) => (
                <div key={app._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{app.doctor?.name || 'Doctor'}</p>
                      <div className="flex gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {app.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {app.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                      app.status === 'DoctorApproved' ? 'bg-green-100 text-green-600' :
                      app.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {app.status}
                    </span>
                    {app.status === 'DoctorApproved' && !app.isPaid && (
                      <button className="block mt-2 text-xs font-bold text-blue-600 underline">Pay Now</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;