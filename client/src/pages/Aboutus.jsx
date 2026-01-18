import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Zap, Users, Heart } from 'lucide-react';
import logo from '../assets/logo.png';

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <ShieldCheck className="text-blue-600" />, title: "Trusted Doctors", desc: "Every provider is verified and vetted for the highest quality care." },
    { icon: <Zap className="text-amber-600" />, title: "Instant Booking", desc: "No more waiting on hold. Book your appointment in under 60 seconds." },
    { icon: <Users className="text-indigo-600" />, title: "Patient-Centric", desc: "Our platform is designed around your convenience and medical history." },
    { icon: <Heart className="text-rose-600" />, title: "Holistic Health", desc: "Access to articles and AI tools to keep you informed daily." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-all">
          <ArrowLeft size={18} /> Back to Home
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-sm border border-slate-100">
          <div className="flex flex-col items-center text-center mb-12">
            <img src={logo} alt="Logo" className="w-16 h-16 mb-4" />
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">About Sumatsina</h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              We are on a mission to bridge the gap between patients and healthcare providers through seamless technology and compassionate design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                To create a world where quality healthcare is a click away, ensuring every individual receives timely medical attention regardless of their location.
              </p>
            </div>
            <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
              <h3 className="text-xl font-bold mb-3">Our Impact</h3>
              <p className="opacity-90 leading-relaxed">
                Serving thousands of patients and partnering with top-tier specialists to provide a centralized hub for all medical needs and records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-12 h-12 bg-white shadow-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-50">
                  {f.icon}
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{f.title}</h4>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;