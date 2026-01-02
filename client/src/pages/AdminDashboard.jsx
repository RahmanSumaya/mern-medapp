import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, BookOpen, LogOut, LayoutDashboard, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 text-indigo-400">MedConnect Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'overview' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'appointments' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <Calendar size={20} /> Appointments
          </button>
          <button onClick={() => setActiveTab('doctor')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'doctor' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <UserPlus size={20} /> Add Doctor
          </button>
          <button onClick={() => setActiveTab('article')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'article' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
            <BookOpen size={20} /> Create Article
          </button>
        </nav>
        <button onClick={handleLogout} className="p-6 flex items-center gap-3 text-red-400 hover:bg-slate-800 border-t border-slate-800">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && <OverviewStats />}
        {activeTab === 'appointments' && <AdminAppointmentManager />}
        {activeTab === 'doctor' && <AddDoctorForm />}
        {activeTab === 'article' && <AddArticleForm />}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: OVERVIEW STATS ---
const OverviewStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-indigo-500">
      <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Active Doctors</h4>
      <p className="text-3xl font-bold text-slate-800 mt-2">12</p>
    </div>
    <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-emerald-500">
      <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Total Appointments</h4>
      <p className="text-3xl font-bold text-slate-800 mt-2">154</p>
    </div>
    <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-500">
      <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Published Articles</h4>
      <p className="text-3xl font-bold text-slate-800 mt-2">28</p>
    </div>
  </div>
);

// --- SUB-COMPONENT: ADMIN APPOINTMENT MANAGER ---
const AdminAppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/appointments/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments");
      }
    };
    fetchAll();
  }, []);

  const handleAdminConfirm = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/appointments/admin-confirm/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Payment Verified & Appointment Confirmed!");
      setAppointments(appointments.map(app => app._id === id ? { ...app, status: 'Confirmed' } : app));
    } catch (err) {
      alert("Verification failed. Ensure status is 'Paid'");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Global Appointment Manager</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-slate-400 text-sm">
              <th className="pb-3 px-2 font-semibold">Patient</th>
              <th className="pb-3 px-2 font-semibold">Doctor</th>
              <th className="pb-3 px-2 font-semibold">Date/Time</th>
              <th className="pb-3 px-2 font-semibold">Status</th>
              <th className="pb-3 px-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {appointments.map(app => (
              <tr key={app._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-2 font-medium">{app.patient?.name}</td>
                <td className="py-4 px-2">{app.doctor?.name}</td>
                <td className="py-4 px-2 text-sm">{app.date} at {app.time}</td>
                <td className="py-4 px-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    app.status === 'Paid' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                    app.status === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-4 px-2">
                  {app.status === 'Paid' && (
                    <button 
                      onClick={() => handleAdminConfirm(app._id)}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition shadow-sm"
                    >
                      <CheckCircle size={14} /> Confirm Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: ADD DOCTOR FORM ---
const AddDoctorForm = () => {
  const [docData, setDocData] = useState({ name: '', email: '', password: '', specialization: '', hourlyRate: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/add-doctor', docData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Doctor Added Successfully!');
      setDocData({ name: '', email: '', password: '', specialization: '', hourlyRate: '' });
    } catch (err) {
      alert('Error adding doctor');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Register New Doctor</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Full Name" className="p-3 border rounded-xl col-span-1 md:col-span-2 bg-slate-50" value={docData.name} onChange={e => setDocData({...docData, name: e.target.value})} required />
        <input type="email" placeholder="Email" className="p-3 border rounded-xl bg-slate-50" value={docData.email} onChange={e => setDocData({...docData, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="p-3 border rounded-xl bg-slate-50" value={docData.password} onChange={e => setDocData({...docData, password: e.target.value})} required />
        <input type="text" placeholder="Specialization" className="p-3 border rounded-xl bg-slate-50" value={docData.specialization} onChange={e => setDocData({...docData, specialization: e.target.value})} />
        <input type="number" placeholder="Hourly Rate ($)" className="p-3 border rounded-xl bg-slate-50" value={docData.hourlyRate} onChange={e => setDocData({...docData, hourlyRate: e.target.value})} />
        <button className="col-span-1 md:col-span-2 bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition mt-2 shadow-lg shadow-indigo-100">Create Doctor Account</button>
      </form>
    </div>
  );
};

// --- SUB-COMPONENT: ADD ARTICLE FORM ---
const AddArticleForm = () => {
  const [article, setArticle] = useState({ title: '', diseaseName: '', content: '', symptoms: '', prevention: '', treatments: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/articles', article, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Article Published Successfully! 🚀');
      setArticle({ title: '', diseaseName: '', content: '', symptoms: '', prevention: '', treatments: '', imageUrl: '' });
    } catch (err) {
      alert('Error publishing article. Make sure you are logged in as Admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setArticle({ ...article, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Create Health Article</h2>
        <p className="text-slate-500 text-sm">Fill in the details to add a new disease guide to the library.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Article Title</label>
            <input name="title" value={article.title} onChange={handleChange} placeholder="e.g. Understanding Type 2 Diabetes" className="p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Disease Name</label>
            <input name="diseaseName" value={article.diseaseName} onChange={handleChange} placeholder="e.g. Diabetes" className="p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">Image URL</label>
          <input name="imageUrl" value={article.imageUrl} onChange={handleChange} placeholder="https://image-link.com/photo.jpg" className="p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">Main Content / Overview</label>
          <textarea name="content" value={article.content} onChange={handleChange} rows="4" placeholder="Write the main description here..." className="p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Symptoms</label>
            <textarea name="symptoms" value={article.symptoms} onChange={handleChange} placeholder="List symptoms..." className="p-3 border rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Prevention</label>
            <textarea name="prevention" value={article.prevention} onChange={handleChange} placeholder="List prevention tips..." className="p-3 border rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">Treatments</label>
            <textarea name="treatments" value={article.treatments} onChange={handleChange} placeholder="List treatments..." className="p-3 border rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        <button disabled={loading} className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}>
          {loading ? 'Publishing...' : 'Publish Article to Library'}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;