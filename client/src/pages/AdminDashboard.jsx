import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserPlus,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Calendar,
  CheckCircle,
  Video,
  Link as LinkIcon,
  Hash,
  Database, // Added this import
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 text-indigo-400">
          Sumtasina Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              activeTab === "overview" ? "bg-indigo-600" : "hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard size={20} /> Overview
          </button>
          
          <button
            onClick={() => setActiveTab("appointments")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              activeTab === "appointments" ? "bg-indigo-600" : "hover:bg-slate-800"
            }`}
          >
            <Calendar size={20} /> Appointments
          </button>

          <button
            onClick={() => setActiveTab("doctor")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              activeTab === "doctor" ? "bg-indigo-600" : "hover:bg-slate-800"
            }`}
          >
            <UserPlus size={20} /> Add Doctor
          </button>

          <button
            onClick={() => setActiveTab("article")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              activeTab === "article" ? "bg-indigo-600" : "hover:bg-slate-800"
            }`}
          >
            <BookOpen size={20} /> Create Article
          </button>

          {/* Dataset Sidebar Button */}
          <button
            onClick={() => setActiveTab("dataset")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
              activeTab === "dataset" ? "bg-indigo-600" : "hover:bg-slate-800"
            }`}
          >
            <Database size={20} /> Dataset
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="p-6 flex items-center gap-3 text-red-400 hover:bg-slate-800 border-t border-slate-800"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === "overview" && <OverviewStats />}
        {activeTab === "appointments" && <AdminAppointmentManager />}
        {activeTab === "doctor" && <AddDoctorForm />}
        {activeTab === "article" && <AddArticleForm />}
        {/* dataset View Added Here */}
        {activeTab === "dataset" && <AdminDatasetManager />}
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
  const [meetingLinks, setMeetingLinks] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/appointments/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };
    fetchAll();
  }, []);

  const handleAdminConfirm = async (id) => {
    const linkToSubmit = meetingLinks[id];
    if (!linkToSubmit || linkToSubmit.trim() === "") {
      return alert("Please enter a meeting link before confirming.");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/appointments/admin-confirm/${id}`,
        { meetingLink: linkToSubmit },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment Verified & Appointment Confirmed!");
      setAppointments(
        appointments.map((app) =>
          app._id === id ? { ...app, status: "Confirmed", meetingLink: linkToSubmit } : app
        )
      );
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
              <th className="pb-3 px-2 font-semibold">Details</th>
              <th className="pb-3 px-2 font-semibold">Status</th>
              <th className="pb-3 px-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {appointments.map((app) => (
              <tr key={app._id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-2 font-medium">
                  <div>{app.user?.name || "Unknown"}</div>
                  <div className="text-[10px] text-slate-400">{app.user?.email}</div>
                </td>
                <td className="py-4 px-2">{app.doctor?.name || "Doctor"}</td>
                <td className="py-4 px-2 text-sm">
                  <div className="font-semibold">{app.date}</div>
                  <div className="text-xs text-slate-500">{app.time}</div>
                </td>
                <td className="py-4 px-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    app.status === "Paid" ? "bg-purple-100 text-purple-700 border-purple-200" :
                    app.status === "Confirmed" ? "bg-green-100 text-green-700 border-green-200" :
                    "bg-gray-100 text-gray-500 border-gray-200"
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="py-4 px-2">
                  {app.status === "Paid" ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Meeting Link"
                        className="p-2 text-xs border rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={meetingLinks[app._id] || ""}
                        onChange={(e) => setMeetingLinks({ ...meetingLinks, [app._id]: e.target.value })}
                      />
                      <button
                        onClick={() => handleAdminConfirm(app._id)}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : <span className="text-xs text-slate-400 italic">No Action Needed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: ADMIN DATASET MANAGER ---
const AdminDatasetManager = () => {
  const [dataset, setdataset] = useState([]);

  useEffect(() => {
    const fetchdataset = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/dataset/admin/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setdataset(res.data);
      } catch (err) {
        console.error("Error fetching dataset");
      }
    };
    fetchdataset();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/dataset/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Dataset Approved!");
      setdataset(dataset.map(ds => ds._id === id ? { ...ds, status: 'Approved' } : ds));
    } catch (err) {
      alert("Approval failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Dataset Approval Queue</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-slate-400 text-sm">
              <th className="pb-3 px-2">Dataset Title</th>
              <th className="pb-3 px-2">Uploaded By</th>
              <th className="pb-3 px-2">Status</th>
              <th className="pb-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataset.map(ds => (
              <tr key={ds._id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-4 px-2 text-sm font-medium">{ds.title}</td>
                <td className="py-4 px-2 text-sm">{ds.doctor?.name}</td>
                <td className="py-4 px-2">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${ds.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {ds.status}
                  </span>
                </td>
                <td className="py-4 px-2">
                  {ds.status === 'Pending' && (
                    <button 
                      onClick={() => handleApprove(ds._id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-indigo-700"
                    >
                      Approve
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
  const [docData, setDocData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    hourlyRate: "",
    experience: "",
    hospitalName: "",
    about: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/admin/add-doctor", docData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Doctor Added Successfully!");
      setDocData({
        name: "",
        email: "",
        password: "",
        specialization: "",
        hourlyRate: "",
        experience: "",
        hospitalName: "",
        about: "",
        address: "",
      });
    } catch (err) {
      alert("Error: " + (err.response?.data?.msg || "Server Error"));
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">
        Register New Doctor
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Full Name"
          className="p-3 border rounded-xl col-span-2 bg-slate-50"
          value={docData.name}
          onChange={(e) => setDocData({ ...docData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-3 border rounded-xl bg-slate-50"
          value={docData.email}
          onChange={(e) => setDocData({ ...docData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 border rounded-xl bg-slate-50"
          value={docData.password}
          onChange={(e) => setDocData({ ...docData, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Specialization"
          className="p-3 border rounded-xl bg-slate-50"
          value={docData.specialization}
          onChange={(e) =>
            setDocData({ ...docData, specialization: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Experience (Years)"
          className="p-3 border rounded-xl bg-slate-50"
          value={docData.experience}
          onChange={(e) =>
            setDocData({ ...docData, experience: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Hospital Name"
          className="p-3 border rounded-xl bg-slate-50"
          value={docData.hospitalName}
          onChange={(e) =>
            setDocData({ ...docData, hospitalName: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Hourly Rate ($)"
          className="p-3 border rounded-xl bg-slate-50"
          value={docData.hourlyRate}
          onChange={(e) =>
            setDocData({ ...docData, hourlyRate: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Work Address"
          className="p-3 border rounded-xl col-span-2 bg-slate-50"
          value={docData.address}
          onChange={(e) => setDocData({ ...docData, address: e.target.value })}
        />
        <textarea
          placeholder="Biography"
          className="p-3 border rounded-xl col-span-2 bg-slate-50 h-32"
          value={docData.about}
          onChange={(e) => setDocData({ ...docData, about: e.target.value })}
        />
        <button className="col-span-2 bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition">
          Create Doctor Account
        </button>
      </form>
    </div>
  );
};

// --- SUB-COMPONENT: ADD ARTICLE FORM ---
// --- SUB-COMPONENT: ADD ARTICLE FORM ---
const AddArticleForm = () => {
  const [article, setArticle] = useState({
    title: "",
    diseaseName: "",
    content: "",
    symptoms: "",
    prevention: "",
    treatments: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // Helper to handle all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/articles", article, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Article Published! 🚀");
      setArticle({
        title: "",
        diseaseName: "",
        content: "",
        symptoms: "",
        prevention: "",
        treatments: "",
        imageUrl: "",
      });
    } catch (err) {
      alert("Error publishing article.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "p-3 border rounded-xl bg-slate-50 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all";

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Create Health Article
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Title and Disease Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={article.title}
            onChange={handleChange}
            placeholder="Article Title"
            className={inputClasses}
            required
          />
          <input
            name="diseaseName"
            value={article.diseaseName}
            onChange={handleChange}
            placeholder="Disease Name (e.g. Type 2 Diabetes)"
            className={inputClasses}
            required
          />
        </div>

        {/* Row 2: Image URL */}
        <input
          name="imageUrl"
          value={article.imageUrl}
          onChange={handleChange}
          placeholder="Header Image URL (https://...)"
          className={inputClasses}
        />

        {/* Row 3: Main Content */}
        <textarea
          name="content"
          value={article.content}
          onChange={handleChange}
          rows="4"
          placeholder="General Overview / Introduction"
          className={inputClasses}
          required
        />

        {/* Row 4: Symptoms, Prevention, Treatments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <textarea
            name="symptoms"
            value={article.symptoms}
            onChange={handleChange}
            placeholder="Symptoms (List them...)"
            className={inputClasses}
            rows="3"
          />
          <textarea
            name="prevention"
            value={article.prevention}
            onChange={handleChange}
            placeholder="Prevention Tips..."
            className={inputClasses}
            rows="3"
          />
          <textarea
            name="treatments"
            value={article.treatments}
            onChange={handleChange}
            placeholder="Available Treatments..."
            className={inputClasses}
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors shadow-lg shadow-indigo-200"
        >
          {loading ? "Publishing..." : "Publish Article"}
        </button>
      </form>
    </div>
  );
};
export default AdminDashboard;
