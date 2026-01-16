import React, { useState, useEffect } from 'react';
// 1. Ensure Link is imported
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios';
import { 
  Star, Clock, MapPin, Award, CheckCircle, 
  Stethoscope, Building, Phone, ArrowLeft 
} from 'lucide-react';

const DoctorDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/doctor/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse text-indigo-600 font-bold text-xl">Loading Profile...</div>
    </div>
  );

  if (!doctor) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Doctor not found</h2>
        <button onClick={() => navigate('/doctors')} className="mt-4 text-indigo-600 flex items-center gap-2">
          <ArrowLeft size={18}/> Back to all doctors
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="flex flex-col md:flex-row">
            
            {/* LEFT COLUMN: Sidebar Profile */}
            <div className="md:w-1/3 bg-indigo-600 p-8 text-white text-center flex flex-col items-center">
              <div className="w-48 h-48 bg-white rounded-3xl mb-6 p-1 shadow-2xl relative">
                <img 
                  src={doctor.profilePic} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover rounded-[1.4rem]"
                />
                <div className="absolute -bottom-3 -right-3 bg-emerald-500 p-2 rounded-xl border-4 border-indigo-600">
                  <CheckCircle size={24} className="text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-extrabold uppercase tracking-tight leading-none mb-2">
                {doctor.name}
              </h1>
              <p className="text-indigo-100 font-medium flex items-center gap-2 mb-6">
                <Stethoscope size={18} /> {doctor.specialization}
              </p>

              <div className="w-full space-y-3 pt-6 border-t border-indigo-500/50">
                <div className="flex justify-between items-center bg-indigo-700/50 p-3 rounded-xl">
                  <span className="text-sm text-indigo-200 uppercase font-bold tracking-widest">Rating</span>
                  <div className="flex items-center gap-1 font-bold">
                    <Star size={16} fill="currentColor" className="text-amber-400" /> 4.9
                  </div>
                </div>
                <div className="flex justify-between items-center bg-indigo-700/50 p-3 rounded-xl">
                  <span className="text-sm text-indigo-200 uppercase font-bold tracking-widest">Fees</span>
                  <span className="text-xl font-black">${doctor.hourlyRate}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Detailed Info */}
            <div className="md:w-2/3 p-8 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm"><Award /></div>
                  <div>
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Experience</p>
                    <p className="text-lg font-bold text-slate-800">{doctor.experience || '5'}+ Years</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm"><Building /></div>
                  <div>
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Hospital</p>
                    <p className="text-lg font-bold text-slate-800">{doctor.hospitalName || 'City Medical Center'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    About the Doctor
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg italic border-l-4 border-indigo-100 pl-6">
                    {doctor.about || "Dr. " + doctor.name + " is a highly skilled specialist committed to providing excellent patient care at " + doctor.hospitalName + "."}
                  </p>
                </section>

                <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Practice Location & Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-red-500 shrink-0 mt-1" size={20} />
                      <p className="text-slate-700 font-medium">{doctor.address || "Medical Plaza, Dhaka, Bangladesh"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-emerald-500 shrink-0" size={20} />
                      <p className="text-slate-700 font-medium">{doctor.phone || "+880 1234-567890"}</p>
                    </div>
                  </div>
                </section>

                {/* 2. UPDATE: Main Action Button - Connected to Routing */}
                <Link to={`/book-appointment/${doctor._id}`}>
                  <button className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-200 active:scale-95">
                    BOOK AN APPOINTMENT
                  </button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;