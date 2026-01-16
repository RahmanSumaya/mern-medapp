import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom'; // Added Link here
import { Search, User, MapPin, Star, Stethoscope } from 'lucide-react';

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    // 1. Check if there is a specialty in the URL
    const params = new URLSearchParams(location.search);
    const specialtyParam = params.get('specialty');
    if (specialtyParam) {
      setFilter(specialtyParam);
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
  }, [location.search]);

  const filteredDoctors = doctors.filter(doc => 
    doc.specialization?.toLowerCase().includes(filter.toLowerCase()) ||
    doc.name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search Bar */}
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
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 font-medium text-slate-500">Loading doctors...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doc) => (
              /* THE CARD */
              <div key={doc._id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 group flex flex-col">
                
                {/* 1. CLICKABLE IMAGE SECTION */}
                <Link to={`/doctor/${doc._id}`} className="relative block">
                  <div className="w-full h-48 bg-blue-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                    {doc.profilePic ? (
                        <img src={doc.profilePic} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                        <User size={60} className="text-blue-200 group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <div className="absolute top-3 right-3 bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                </Link>

                <div className="space-y-2 flex-grow">
                  <div className="flex justify-between items-start">
                    {/* 2. CLICKABLE NAME */}
                    <Link to={`/doctor/${doc._id}`}>
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight leading-tight hover:text-blue-600 transition-colors">
                            {doc.name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                      <Star size={14} fill="currentColor" /> 4.9
                    </div>
                  </div>
                  
                  <p className="text-blue-600 font-semibold text-sm flex items-center gap-1">
                    <Stethoscope size={14} /> {doc.specialization}
                  </p>
                  
                  <p className="text-slate-500 text-xs flex items-center gap-1">
                    <MapPin size={14} /> {doc.hospitalName || "General Hospital, Dhaka"}
                  </p>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-50 mt-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Fee</p>
                      <p className="text-lg font-bold text-slate-800">${doc.hourlyRate || '50'}</p>
                    </div>

                    {/* 3. CLICKABLE BUTTON */}
                    <Link to={`/doctor/${doc._id}`}>
                        <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors">
                            Book Now
                        </button>
                    </Link>
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