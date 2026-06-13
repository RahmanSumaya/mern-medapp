import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Check, X, Clock, Stethoscope, LogOut, CreditCard, Video, ExternalLink, ArrowLeft, ShoppingBag, CheckCircle } from 'lucide-react';
import Chatbot from './Chatbot';

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
  const [medicalOrders, setMedicalOrders] = useState([]);        // NEW
  const [transactionId, setTransactionId] = useState("");
  const [payingFor, setPayingFor] = useState(null);
  const [payingForOrder, setPayingForOrder] = useState(null);    // NEW

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

        // === NEW: Fetch Medical Shop Orders ===
        const ordersRes = await axios.get('http://localhost:5000/api/shop/my-orders', { headers });
        setMedicalOrders(ordersRes.data);

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
      const res = await axios.get('http://localhost:5000/api/appointments/my-appointments', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setAppointments(res.data);
    } catch (err) {
      alert("Payment submission failed");
    }
  };

  // === NEW: Handle Medical Order Payment ===
  const handleOrderPaymentSubmit = async (orderId) => {
    if (!transactionId) return alert("Please enter a Transaction ID");
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/shop/submit-transaction/${orderId}`, 
        { transactionNumber: transactionId }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert("Payment Details Sent! Waiting for Admin verification.");
      setPayingForOrder(null);
      setTransactionId("");

      // Refresh orders
      const res = await axios.get('http://localhost:5000/api/shop/my-orders', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMedicalOrders(res.data);
    } catch (err) {
      alert("Payment submission failed");
    }
  };

  // === NEW: Map Order Status to Badge ===
  const mapOrderStatus = (status) => {
    const map = {
      booked: "Pending",
      awaiting_payment: "DoctorApproved",
      verifying: "Paid",
      confirmed: "Confirmed"
    };
    return map[status] || status;
  };

  if (loading) return <div className="p-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 space-y-10">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
        >
          <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Back to Home
        </button>
      </div>

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
            <div className="flex flex-wrap gap-3 justify-end">
              {!isEditing ? (
                <>
                  <button 
                    onClick={() => navigate('/patientRecords')}
                    className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition border border-indigo-100"
                  >
                    <Clock size={16} /> My Medical History
                  </button>

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
                      
                      {app.status === 'DoctorApproved' && (
                        <button 
                          onClick={() => setPayingFor(payingFor === app._id ? null : app._id)}
                          className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center gap-2"
                        >
                          <CreditCard size={14} /> {payingFor === app._id ? "Close" : "Pay Now"}
                        </button>
                      )}

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

                  {payingFor === app._id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Submit Transaction Details</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter Transaction ID" 
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

      {/* === NEW SECTION: MEDICAL SHOP ORDERS === */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShoppingBag size={20} className="text-indigo-600"/> Medical Shop Purchases
          </h2>
          
          <div className="space-y-4">
            {medicalOrders.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">No medical purchases yet.</p>
              </div>
            ) : (
              medicalOrders.map((order) => (
                <div key={order._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm border border-slate-50">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-800">{order.itemId?.name || 'Medical Item'}</p>
                        <p className="text-slate-600 font-medium">${order.itemId?.price}</p>
                        <div className="flex gap-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock size={14}/> {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                      <StatusBadge status={mapOrderStatus(order.status)} />
                      
                      {(order.status === 'booked' || order.status === 'awaiting_payment') && (
                        <button 
                          onClick={() => setPayingForOrder(payingForOrder === order._id ? null : order._id)}
                          className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center gap-2"
                        >
                          <CreditCard size={14} /> 
                          {payingForOrder === order._id ? "Close" : "Pay Now"}
                        </button>
                      )}

                      {order.status === 'confirmed' && (
                        <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                          <CheckCircle size={14} /> Confirmed
                        </span>
                      )}
                    </div>
                  </div>

                  {payingForOrder === order._id && (
                    <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">Submit Transaction Details</p>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter Transaction ID" 
                          className="flex-1 p-2 bg-white border rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-500"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                        />
                        <button 
                          onClick={() => handleOrderPaymentSubmit(order._id)}
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
      
      {/* SECTION 3: CHATBOT */}
      <Chatbot />
    </div>
  );
};

export default PatientDashboard;