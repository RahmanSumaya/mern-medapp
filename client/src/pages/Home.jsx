import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Categories for the dynamic buttons
  const specialties = [
    "Neurologist", "Cardiologist", "Oncologist", 
    "Dermatologist", "Orthopedic Surgeon", "General Physician"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 font-sans">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 text-white p-1 rounded font-bold">logo</div>
          <span className="text-xl font-bold text-slate-800">Sumatsina</span>
        </div>
        
        <div className="hidden md:flex gap-8 font-medium text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-blue-600 border-b-2 border-blue-600">Home</button>
          <button onClick={() => navigate('/all-doctors')} className="hover:text-blue-600">All Doctors</button>
          <button className="hover:text-blue-600">Contact</button>
          <button className="hover:text-blue-600">About Us</button>
        </div>

        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Account
        </button>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-6xl mx-auto px-6 py-12 text-center">
        {/* Top Image Box */}
        <div className="w-full h-64 bg-gray-200 rounded-3xl mb-12 overflow-hidden shadow-xl border-4 border-white">
          <img 
            src="https://img.freepik.com/free-photo/doctor-offering-medical-teleconsultation_23-2149329007.jpg" 
            alt="Medical Research" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-8 leading-tight">
          Find Doctors based on your preference <br /> to make appointment
        </h1>

        {/* Dynamic Specialty Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {/* In Home.jsx */}
{specialties.map((item) => (
  <button 
    key={item}
    onClick={() => navigate(`/all-doctors?specialty=${item}`)} // Send the specialty in the URL
    className="px-5 py-2 bg-white rounded-full text-slate-700 font-medium shadow-md hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
  >
    {item}
  </button>
))}
        </div>

        {/* Bottom Image Box */}
        <div className="w-full h-64 bg-gray-200 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <img 
            src="https://img.freepik.com/free-photo/medical-stethoscope-with-paper-clipboard_23-2148113110.jpg" 
            alt="Medical Research" 
            className="w-full h-full object-cover"
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white mt-20 pt-16 pb-8 px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-slate-800 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-slate-900 p-1 rounded font-bold">logo</div>
              <span className="text-xl font-bold">Sumatsina</span>
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
                <li className="hover:text-white cursor-pointer transition">✓ About Us</li>
                <li className="hover:text-white cursor-pointer transition">✓ Contact Us</li>
                <li className="hover:text-white cursor-pointer transition">✓ Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition">✓ Home</li>
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