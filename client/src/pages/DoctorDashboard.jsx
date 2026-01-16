import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Check, Video, ExternalLink, Hourglass, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    DoctorApproved: "bg-blue-100 text-blue-700 border-blue-200",
    Paid: "bg-purple-100 text-purple-700 border-purple-200",
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Note: Using the endpoint from your appointmentRoutes.js
        const res = await axios.get('http://localhost:5000/api/appointments/doctor-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching doctor data");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      // Updated endpoint to match your routes/appointmentRotes.js
      await axios.put(`http://localhost:5000/api/appointments/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Approved! The patient can now proceed to payment.");
      setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'DoctorApproved' } : app));
    } catch (err) {
      alert("Approval failed");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500 font-bold">Loading Your Schedule...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">DOCTOR DASHBOARD</h1>
          <p className="text-slate-500 font-medium">Manage your patient requests and upcoming meetings.</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: PENDING REQUESTS (2 Cols Wide) */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Hourglass className="text-amber-500" size={22} /> New Patient Requests
              </h2>
              
              <div className="space-y-4">
                {appointments.filter(a => a.status === 'Pending').length === 0 ? (
                  <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 italic">
                    No pending requests at the moment.
                  </div>
                ) : (
                  appointments.filter(a => a.status === 'Pending').map(app => (
                    <div key={app._id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl text-amber-600 shadow-sm"><User size={24}/></div>
                        <div>
                          <p className="font-black text-slate-800 uppercase tracking-tight">{app.user?.name || 'Unknown Patient'}</p>
                          <div className="flex gap-4 text-xs font-bold text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {app.date}</span>
                            <span className="flex items-center gap-1"><Clock size={14}/> {app.time}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleApprove(app._id)}
                        className="mt-4 md:mt-0 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                      >
                        Accept Request
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* UPCOMING CONFIRMED MEETINGS */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-emerald-600 mb-6 flex items-center gap-2">
                <Check size={22} /> Confirmed Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.filter(a => a.status === 'Confirmed').map(app => (
                  <div key={app._id} className="p-5 border rounded-2xl bg-emerald-50 border-emerald-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-emerald-100 text-emerald-600 rounded-bl-xl">
                      <Check size={16} />
                    </div>
                    <p className="font-bold text-slate-800">{app.user?.name}</p>
                    <div className="text-sm text-slate-600 mt-2 space-y-1">
                      <p className="flex items-center gap-2 font-medium text-xs uppercase text-slate-400 tracking-widest"><Calendar size={14}/> {app.date}</p>
                      <p className="flex items-center gap-2 font-medium text-xs uppercase text-slate-400 tracking-widest"><Clock size={14}/> {app.time}</p>
                    </div>
                    
                    {app.meetingLink && (
                      <a 
                        href={app.meetingLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-slate-900 transition-colors"
                      >
                        <Video size={14} /> START MEETING
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDE: WAITING AREA */}
          <div className="space-y-6">
            <div className="bg-indigo-900 text-white p-6 rounded-[2rem] shadow-xl">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <AlertCircle size={18} /> Process Overview
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-700 flex items-center justify-center shrink-0">1</div>
                  <p className="text-indigo-200">Approve patient requests to allow them to pay.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-700 flex items-center justify-center shrink-0">2</div>
                  <p className="text-indigo-200">Wait for Admin to verify payment and set the link.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-700 flex items-center justify-center shrink-0">3</div>
                  <p className="text-indigo-200">Meeting links appear automatically in "Confirmed Schedule".</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-widest">Awaiting Payment</h3>
              <div className="space-y-3">
                {appointments.filter(a => a.status === 'DoctorApproved' || a.status === 'Paid').map(app => (
                  <div key={app._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{app.user?.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{app.date}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
                {appointments.filter(a => a.status === 'DoctorApproved' || a.status === 'Paid').length === 0 && (
                  <p className="text-[10px] text-slate-400 italic">No pending payments.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;