import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Check, X, Clock, Stethoscope, LogOut, CreditCard, Video, ExternalLink } from 'lucide-react';

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

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  
  // New state for payment handling
  const [transactionId, setTransactionId] = useState("");
  const [payingFor, setPayingFor] = useState(null); // ID of the appointment being paid

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const profileRes = await axios.get('http://localhost:5000/api/auth/me', { headers });
        setUserData(profileRes.data);
        setFormData(profileRes.data);

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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // NEW: Payment submission logic
  const handlePaymentSubmit = async (appId) => {
    if (!transactionId) return alert("Please enter a Transaction ID");
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/pay/${appId}`, 
        { transactionId }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert("Payment Details Sent! Waiting for Admin verification.");
      setPayingFor(null);
      setTransactionId("");
      // Refresh list
      const res = await axios.get('http://localhost:5000/api/appointments/my-appointments', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setAppointments(res.data);
    } catch (err) {
      alert("Payment submission failed");
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
            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-200 transition">
                    <Edit2 size={16} /> Edit Profile
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 transition">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-red-500 transition"><X /></button>
                  <button onClick={handleUpdate} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition">
                    <Check size={16} /> Save Changes
                  </button>
                </div>
              )}
            </div>
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

      {/* SECTION 2: APPOINTMENT LIST */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600"/> Appointment Status
          </h2>
          
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">You have no scheduled appointments.</p>
              </div>
            ) : (
              appointments.map((app) => (
                <div key={app._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm border border-slate-50">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-800">{app.doctor?.name || 'Doctor'}</p>
                        <div className="flex gap-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar size={14}/> {app.date}</span>
                          <span className="flex items-center gap-1"><Clock size={14}/> {app.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                      <StatusBadge status={app.status} />
                      
                      {/* ACTION: PAYMENT BOX */}
                      {app.status === 'DoctorApproved' && (
                        <button 
                          onClick={() => setPayingFor(payingFor === app._id ? null : app._id)}
                          className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center gap-2"
                        >
                          <CreditCard size={14} /> {payingFor === app._id ? "Close" : "Pay Now"}
                        </button>
                      )}

                      {/* ACTION: MEETING LINK */}
                      {app.status === 'Confirmed' && app.meetingLink && (
                        <a 
                          href={app.meetingLink} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-2"
                        >
                          <Video size={14} /> Join Meeting <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* EXPANDABLE PAYMENT FORM */}
                  {payingFor === app._id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Submit Transaction Details</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter Transaction ID (e.g. TRX9921...)" 
                          className="flex-1 p-2 bg-white border rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-500"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                        <button 
                          onClick={() => handlePaymentSubmit(app._id)}
                          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-600 transition"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
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