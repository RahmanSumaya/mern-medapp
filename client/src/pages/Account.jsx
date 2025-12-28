import React from 'react';
import { Link } from 'react-router-dom';
import { User, Stethoscope } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4">
          MedConnect
        </h1>
        <p className="text-xl text-blue-700 max-w-md mx-auto">
          Your trusted bridge to quality healthcare. Expert doctors, just a click away.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        {/* Sign Up Card */}
        <Link to="/signup" 
  className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-500 text-left block"
>
  <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
    <User className="text-blue-600 group-hover:text-white" size={30} />
  </div>
  <h2 className="text-2xl font-bold text-gray-800">New Patient?</h2>
  <p className="text-gray-500 mt-2">Create an account to browse doctors and book appointments.</p>
  <div className="mt-4 text-blue-600 font-semibold">Sign Up Now →</div>
</Link>

        {/* Login Card */}
        <Link 
  to="/login" 
  className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-indigo-500 text-left block"
>
  <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
    <Stethoscope className="text-indigo-600 group-hover:text-white" size={30} />
  </div>
  <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
  <p className="text-gray-500 mt-2">Login to manage your health records or doctor schedule.</p>
  <div className="mt-4 text-indigo-600 font-semibold">Login to Portal →</div>
</Link>
      </div>
    </div>
  );
};

export default Home;