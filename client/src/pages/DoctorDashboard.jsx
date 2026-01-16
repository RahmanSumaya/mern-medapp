import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, Clock, User, Check, Video, AlertCircle, 
  Upload, Database, LayoutDashboard, FileText 
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

// ... (previous imports: useState, useEffect, axios, lucide-react icons)

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [mydataset, setMydataset] = useState([]); // New state for dataset
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch both Appointments and Doctor's own dataset
      const [appRes, dsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments/doctor-requests', { headers }),
        axios.get('http://localhost:5000/api/dataset/doctor/my-uploads', { headers })
      ]);

      setAppointments(appRes.data);
      setMydataset(dsRes.data);
    } catch (err) {
      console.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:block sticky top-0 h-screen">
        <h2 className="text-xl font-black text-indigo-400 mb-10">MEDCONNECT</h2>
        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === 'appointments' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} /> Appointments
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${activeTab === 'upload' ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
          >
            <Upload size={20} /> Manage dataset
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-12">
        {activeTab === 'appointments' ? (
          /* ... Your Existing Appointments UI ... */
          <div>Appointment View...</div>
        ) : (
          <div className="space-y-10">
            {/* 1. UPLOAD FORM */}
            <UploadDatasetForm onUploadSuccess={fetchInitialData} />

            {/* 2. HISTORY TABLE */}
            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="text-indigo-500" size={22} /> My Upload History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-50">
                      <th className="pb-4 px-2">Title</th>
                      <th className="pb-4 px-2">Date</th>
                      <th className="pb-4 px-2">Downloads</th>
                      <th className="pb-4 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myataset.map((ds) => (
                      <tr key={ds._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="py-4 px-2 font-bold text-slate-700 text-sm">{ds.title}</td>
                        <td className="py-4 px-2 text-slate-500 text-xs">{new Date(ds.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-2 text-slate-500 text-xs font-mono">{ds.downloadCount || 0}</td>
                        <td className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            ds.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {ds.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {myDataset.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-10 text-center text-slate-400 italic">No dataset uploaded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

// IMPROVED UPLOAD FORM COMPONENT
const UploadDatasetForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Please provide both title and file.");

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/dataset/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      alert("Dataset uploaded successfully! It is now pending Admin approval.");
      setTitle('');
      setFile(null);
    } catch (err) {
      alert("Upload failed. Make sure the file is under 10MB.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">
          <Database size={30} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Upload Research Dataset</h2>
          <p className="text-slate-500 text-sm">Contribute medical data to the public library.</p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Dataset Title</label>
          <input 
            type="text" 
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g., Heart Disease Patterns 2024"
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select File (CSV, PDF, ZIP)</label>
          <div className="relative group">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => setFile(e.target.files[0])} 
            />
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center group-hover:border-indigo-400 transition-colors">
              <Upload className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-500 font-medium">
                {file ? file.name : "Click to browse or drag and drop"}
              </p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
        >
          {uploading ? "Processing..." : <><Check size={18} /> Submit for Review</>}
        </button>
      </form>
    </div>
  );
};

export default DoctorDashboard;