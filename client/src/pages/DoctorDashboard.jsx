import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Check, X } from 'lucide-react';
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
const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/appointments/doctor-appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    };
    fetchDoctorData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/approve-doctor/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Approved! Waiting for payment.");
      setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'DoctorApproved' } : app));
    } catch (err) {
      alert("Approval failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Doctor Schedule Control</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {/* SECTION: NEW REQUESTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
            <Clock size={20} /> Pending Approvals
          </h2>
          <div className="space-y-4">
            {appointments.filter(a => a.status === 'Pending').map(app => (
              <div key={app._id} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg text-orange-600"><User /></div>
                  <div>
                    <p className="font-bold">{app.patient?.name}</p>
                    <p className="text-sm text-slate-500">{app.date} | {app.time}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleApprove(app._id)}
                  className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition"
                >
                  Approve Request
                </button>
              </div>
            ))}
            {appointments.filter(a => a.status === 'Pending').length === 0 && <p className="text-slate-400">No new requests.</p>}
          </div>
        </div>

        {/* SECTION: CONFIRMED APPOINTMENTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
            <Check size={20} /> Your Confirmed Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.filter(a => a.status === 'Confirmed').map(app => (
              <div key={app._id} className="p-4 border rounded-xl bg-green-50 border-green-100">
                <p className="font-bold text-slate-800">{app.patient?.name}</p>
                <div className="text-sm text-slate-600 mt-2">
                  <p className="flex items-center gap-2"><Calendar size={14}/> {app.date}</p>
                  <p className="flex items-center gap-2"><Clock size={14}/> {app.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;