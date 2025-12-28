import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Check, X } from 'lucide-react';

const PatientDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data);
      setIsEditing(false);
      alert("Profile Updated!");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-lg">
              <div className="w-full h-full bg-slate-100 rounded-[1.25rem] flex items-center justify-center text-blue-600">
                <User size={40} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{userData?.name}</h1>
              <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">{userData?.role}</p>
            </div>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-red-500 transition"><X /></button>
                <button onClick={handleUpdate} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition">
                  <Check size={16} /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field: Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
              {isEditing ? (
                <input 
                  className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              ) : (
                <div className="flex items-center gap-3 text-slate-700 font-medium p-1">
                  <User size={18} className="text-slate-400" /> {userData?.name}
                </div>
              )}
            </div>

            {/* Field: Email (Read Only usually) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
              <div className="flex items-center gap-3 text-slate-400 font-medium p-1">
                <Mail size={18} /> {userData?.email}
              </div>
            </div>

            {/* Field: Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
              {isEditing ? (
                <input 
                  className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+880..."
                />
              ) : (
                <div className="flex items-center gap-3 text-slate-700 font-medium p-1">
                  <Phone size={18} className="text-slate-400" /> {userData?.phone || 'Not set'}
                </div>
              )}
            </div>

            {/* Field: Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Address</label>
              {isEditing ? (
                <input 
                  className="w-full p-3 bg-slate-50 border rounded-xl outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              ) : (
                <div className="flex items-center gap-3 text-slate-700 font-medium p-1">
                  <MapPin size={18} className="text-slate-400" /> {userData?.address || 'Not set'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;