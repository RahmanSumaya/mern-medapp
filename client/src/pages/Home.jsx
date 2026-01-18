import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut } from 'lucide-react'; 
import header from '../assets/header.jpg';
import header1 from '../assets/header1.jpg';
import logo from '../assets/logo.png';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    setIsLoggedIn(false);            // Update local state
    navigate('/');                   // Redirect to home page
  };
const handleDashboardClick = () => {
  // 1. Get user data (assuming it's stored as a JSON string in localStorage)
  const user = JSON.parse(localStorage.getItem("user")); 
  const role = user?.role; // 'admin', 'doctor', or 'user'
console.log("Current Role:", role); // This will tell you exactly what is being read
  // 2. Decide the path
  if (role === "admin") {
    navigate("/admin-dashboard");
  } else if (role === "doctor") {
    navigate("/dashboard_doctor");
  } else {
    navigate("/dashboard");
  }
};
  // Categories for the dynamic buttons
  const specialties = [
    "Neurologist", "Cardiologist", "Oncologist", 
    "Dermatologist", "Orthopedic Surgeon", "General Physician"
  ];

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-200 font-sans">      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
  {/* The Logo Image */}
  <img src={logo} alt="Sumatsina Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-slate-800">Sumatsina</span>
        </div>
        
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-blue-600 border-b-2 border-blue-600">Home</button>
          <button onClick={() => navigate('/all-doctors')} className="hover:text-blue-600">All Doctors</button>
          <button className="hover:text-blue-600">Contact</button>
          <button onClick={() => navigate('/about')} className="hover:text-blue-600">About Us</button>
          <button onClick={() => navigate('/datasets')} className="hover:text-blue-600">Dataset</button>
          <button onClick={() => navigate('/library')} className="hover:text-blue-600">Article Library</button>
        </div>

        {/* AUTH SECTION */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Dashboard Icon */}
              <button 
  onClick={handleDashboardClick}
  className="text-blue-600 hover:text-blue-800 transition-colors"
  title="Go to Dashboard"
>
  <UserCircle size={35} strokeWidth={1.5} />
</button>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/account')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Account
            </button>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-6xl mx-auto px-6 py-12 text-center">
        {/* Top Image Box */}
        <div className="w-full h-80 bg-gray-200 rounded-2xl mb-15 overflow-hidden shadow-xl border-1">
     <img src={header} alt="Header" className="w-full h-full object-cover" />         
      
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-8 leading-tight">
          Find Doctors based on your preference <br /> to make appointment
        </h1>

        {/* Dynamic Specialty Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {specialties.map((item) => (
            <button 
              key={item}
              onClick={() => navigate(`/all-doctors?specialty=${item}`)} 
              className="px-5 py-2 bg-white rounded-full text-slate-700 font-medium shadow-md hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Bottom Image Box */}
        <div className="w-full h-80 bg-gray-200 rounded-3xl overflow-hidden shadow-xl border-1 border-white">
          <img 
         src={header1} alt="Header" className="w-full h-full object-cover" />
            
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white mt-20 pt-16 pb-8 px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-slate-800 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
  {/* The Logo Image */}
  <img src={logo} alt="Sumatsina Logo" className="w-8 h-8 object-contain" />
  
  {/* The Brand Name */}
<span className="text-xl font-bold tracking-tight text-white">    Sumatsina
  </span>
</div>
            <h3 className="text-lg font-semibold mb-2">Appointy – Effortless Healthcare Scheduling</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Patients can instantly book appointments with trusted doctors. Our smart 
              reminders keep appointments on track, while real-time updates 
              seamlessly coordinate. Designed for healthcare, we save time 
              for both patients and providers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-indigo-400 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li onClick={() => navigate('/about')} className="hover:text-white cursor-pointer transition">✓ About Us</li>
                <li className="hover:text-white cursor-pointer transition">✓ Contact Us</li>
                <li className="hover:text-white cursor-pointer transition">✓ Privacy Policy</li>
                <li onClick={() => navigate('/')} className="hover:text-white cursor-pointer transition">✓ Home</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-500 text-xs mt-8">© 2025 Sumatsina. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;