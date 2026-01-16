import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, Clock, User, Check, Video, AlertCircle, 
  Upload, Database, LayoutDashboard, FileText,
  UserCog, DollarSign, Save, Camera, MapPin, Phone, Award, Link
} from 'lucide-react';

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
  const [myDataset, setMyDataset] = useState([]);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [meetingLinks, setMeetingLinks] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [appRes, dsRes, profileRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments/doctor-requests', { headers }),
        axios.get('http://localhost:5000/api/dataset/doctor/my-uploads', { headers }),
        axios.get('http://localhost:5000/api/users/profile', { headers })
      ]);

      setAppointments(appRes.data);
      setMyDataset(dsRes.data);
      setDoctorData(profileRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };
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
  const totalEarnings = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Paid').length * (doctorData?.hourlyRate || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:block sticky top-0 h-screen shadow-2xl">
        <div className="mb-10 px-2">
            <h2 className="text-2xl font-black text-indigo-400 tracking-tighter">MEDCONNECT</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Doctor Portal</p>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === 'appointments' ? 'bg-indigo-600 shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard size={20} /> <span className="font-bold text-sm">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === 'upload' ? 'bg-indigo-600 shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Database size={20} /> <span className="font-bold text-sm">Research Data</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-indigo-600 shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <UserCog size={20} /> <span className="font-bold text-sm">My Profile</span>
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {/* TOP HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex items-center gap-5">
            <img 
              src={doctorData?.profilePic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
              className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-sm"
              alt="Doctor"
            />
            <div>
              <h1 className="text-3xl font-black text-slate-800">Dr. {doctorData?.name || 'User'}</h1>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <Award size={16} className="text-indigo-500" /> {doctorData?.specialization || 'Medical Specialist'}
              </p>
            </div>
          </div>

          <div className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center pr-8 border border-slate-100">
             <div className="bg-indigo-600 text-white p-5 rounded-[2rem] shadow-lg shadow-indigo-200 mr-5">
                <DollarSign size={28} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
                <p className="text-3xl font-black text-slate-800">${totalEarnings}</p>
             </div>
          </div>
        </div>

       {/* APPOINTMENTS TAB */}
        {/* APPOINTMENTS CONTENT */}
        {activeTab === 'appointments' && (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                 <Calendar className="text-indigo-500" /> Patient Schedule
              </h3>
              
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium italic">No appointments found.</p>
                  </div>
                ) : (
                  appointments.map((app) => (
                    <div key={app._id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 font-black text-xl">
                            {app.user?.name?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 uppercase text-lg tracking-tighter">{app.user?.name || 'Unknown Patient'}</p>
                            <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              <span className="flex items-center gap-1"><Calendar size={12}/> {app.date}</span>
                              <span className="flex items-center gap-1"><Clock size={12}/> {app.time}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <StatusBadge status={app.status} />
                          
                          {/* DOCTOR APPROVAL BUTTON (Visible only when Pending) */}
                          {app.status === 'Pending' && (
                            <button 
                              onClick={() => handleApprove(app._id)}
                              className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg"
                            >
                              Confirm Availability
                            </button>
                          )}

                          {/* JOIN MEETING BUTTON (Visible only when Admin has provided it) */}
                          {app.status === 'Confirmed' && app.meetingLink && (
                            <a 
                              href={app.meetingLink} 
                              target="_blank" 
                              rel="noreferrer"
                              className="bg-emerald-600 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                            >
                              <Video size={18} /> Join Session
                            </a>
                          )}
                          
                          {app.status === 'DoctorApproved' && (
                             <span className="text-[10px] font-black text-slate-400 uppercase italic">Awaiting Payment/Admin</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
        
        {/* TAB CONTENT: DATASET UPLOAD */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
                <UploadDatasetForm onUploadSuccess={fetchInitialData} />
            </div>

            <div className="lg:col-span-2">
                <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                        <FileText className="text-indigo-500" /> Research History
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-5 px-2">Dataset Name</th>
                                    <th className="pb-5 px-2 text-center">Downloads</th>
                                    <th className="pb-5 px-2 text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {myDataset.map((ds) => (
                                    <tr key={ds._id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-5 px-2">
                                            <p className="font-bold text-slate-700 text-sm">{ds.title}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Uploaded: {new Date(ds.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="py-5 px-2 text-center text-sm font-mono text-slate-500">
                                            {ds.downloadCount || 0}
                                        </td>
                                        <td className="py-5 px-2 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                                ds.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {ds.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
          </div>
        )}

        {/* TAB CONTENT: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <EditDoctorProfile initialData={doctorData} onUpdate={fetchInitialData} />
        )}

      </div>
    </div>
  );
};

/* --- FORM COMPONENT: UPLOAD DATASET --- */
const UploadDatasetForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("All fields are required.");
    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/dataset/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      alert("Dataset submitted for admin approval!");
      setTitle(''); setFile(null);
      onUploadSuccess();
    } catch (err) {
      alert("Upload failed.");
    } finally { setUploading(false); }
  };

  return (
    <div className="bg-indigo-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-white/10 rounded-xl"><Upload size={24} /></div>
        <h2 className="text-xl font-bold">New Research</h2>
      </div>
      <form onSubmit={handleUpload} className="space-y-5">
        <input 
          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:bg-white/10 text-sm"
          placeholder="Dataset Title" value={title} onChange={(e) => setTitle(e.target.value)}
        />
        <div className="relative border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:bg-white/5 transition-all">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
            <p className="text-xs font-bold text-indigo-200">{file ? file.name : "Select Data File (CSV/PDF)"}</p>
        </div>
        <button className="w-full bg-white text-indigo-900 p-4 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all">
          {uploading ? "Uploading..." : "Publish Data"}
        </button>
      </form>
    </div>
  );
};

/* --- FORM COMPONENT: EDIT PROFILE --- */
const EditDoctorProfile = ({ initialData, onUpdate }) => {
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Professional profile updated!");
      onUpdate();
    } catch (err) {
      alert("Error saving profile");
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 max-w-5xl">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><UserCog size={24} /></div>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Profile Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
          <div className="relative group">
            <img src={formData?.profilePic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl" alt="Profile" />
            <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" /></div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avatar Source URL</label>
            <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={formData?.profilePic || ''} onChange={(e) => setFormData({...formData, profilePic: e.target.value})} placeholder="Image link (e.g., Cloudinary)" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 ml-2">Consultation Fee ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="number" className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-500 font-bold" value={formData?.hourlyRate || ''} onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 ml-2">Years of Experience</label>
          <div className="relative">
            <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="number" className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-500 font-bold" value={formData?.experience || ''} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 ml-2">Phone Contact</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-500 font-bold" value={formData?.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 ml-2">Hospital/Clinic Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-500 font-bold" value={formData?.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold text-slate-500 ml-2">Professional Biography</label>
          <textarea rows="4" className="w-full p-5 bg-slate-50 rounded-3xl outline-none border border-transparent focus:border-indigo-500 text-sm leading-relaxed" value={formData?.about || ''} onChange={(e) => setFormData({...formData, about: e.target.value})} placeholder="Write a short intro for your patients..." />
        </div>

        <button type="submit" disabled={saving} className="md:col-span-2 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
          {saving ? "Processing..." : <><Save size={18} /> Save Professional Profile</>}
        </button>
      </form>
    </div>
  );
};

export default DoctorDashboard;