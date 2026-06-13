import React, { useState } from "react";
import axios from "axios";
import { Truck, Search, Phone } from "lucide-react";

const PatientAmbulanceService = () => {
  const [district, setDistrict] = useState("");
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchAmbulances = async (e) => {
    e.preventDefault();
    if (!district.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/ambulance/district/${district}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAmbulances(res.data);
    } catch (err) {
      alert("Error finding available drivers for this region.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAmbulance = async (ambulanceId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:5000/api/ambulance/book/${ambulanceId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.msg);
      // Remove booked driver from current list display
      setAmbulances(ambulances.filter((amb) => amb._id !== ambulanceId));
    } catch (err) {
      alert(err.response?.data?.msg || "Booking process failure.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
          <Truck size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">24/7 Emergency Ambulance Network</h2>
          <p className="text-xs text-slate-500">Locate immediate healthcare transport by regional zone</p>
        </div>
      </div>

      {/* SEARCH FORM */}
      <form onSubmit={searchAmbulances} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter your current District (e.g., Dhaka, Chittagong)"
          className="flex-1 p-3 border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 text-sm transition"
        >
          <Search size={16} /> Search
        </button>
      </form>

      {/* DRIVERS RENDER GRID */}
      {loading ? (
        <p className="text-sm text-center text-slate-500 animate-pulse">Scanning database servers...</p>
      ) : ambulances.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-4">No available emergency teams located in this sector active right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ambulances.map((amb) => (
            <div key={amb._id} className="p-4 border rounded-xl bg-slate-50 flex justify-between items-center hover:shadow-sm transition">
              <div>
                <h4 className="font-bold text-slate-800">{amb.driverName}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <Phone size={12} /> {amb.driverNumber}
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold uppercase rounded">
                  Area: {amb.district}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAmbulanceService;
