import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Add this
import { Search, User, MapPin, Star, Stethoscope } from 'lucide-react';

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  const location = useLocation(); // Get access to the URL

  useEffect(() => {
    // 1. Check if there is a specialty in the URL (e.g., ?specialty=Cardiologist)
    const params = new URLSearchParams(location.search);
    const specialtyParam = params.get('specialty');
    if (specialtyParam) {
      setFilter(specialtyParam); // Auto-fill the search bar with that specialty
    }

    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [location.search]); // Re-run if the URL changes

  // Filter logic stays the same
  const filteredDoctors = doctors.filter(doc => 
    doc.specialization?.toLowerCase().includes(filter.toLowerCase()) ||
    doc.name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Available Specialists</h1>
            <p className="text-slate-500 mt-2">Find and book appointments with top-rated doctors.</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or specialty..." 
              className="w-full p-3 pl-12 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading doctors...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doc) => (
              <div key={doc._id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                <div className="w-full h-48 bg-blue-50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <User size={60} className="text-blue-200 group-hover:scale-110 transition-transform" />
                  <div className="absolute top-3 right-3 bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-sm"></div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight leading-tight">{doc.name}</h3>
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                      <Star size={14} fill="currentColor" /> 4.9
                    </div>
                  </div>
                  
                  <p className="text-blue-600 font-semibold text-sm flex items-center gap-1">
                    <Stethoscope size={14} /> {doc.specialization}
                  </p>
                  
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <MapPin size={14} /> {doc.address || "Medical Center, Dhaka"}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Fee</p>
                      <p className="text-lg font-bold text-slate-800">${doc.hourlyRate || '50'}</p>
                    </div>
                    <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDoctors;