import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sending request to your login controller
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // 1. Save data to localStorage (Matches your authController output)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role); 
      localStorage.setItem('userId', res.data.user.id);
      
      // 2. Role-Based Redirection
      // Note: We use 'user' here because your UserSchema defines the role as 'user' (patient)
      const userRole = res.data.user.role;

      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'doctor') {
        navigate('/dashboard_doctor');
      } else if (userRole === 'user') {
        navigate('/dashboard'); // This is your Patient/User Dashboard
      } else {
        navigate('/'); // Fallback for safety
      }

    } catch (err) {
      // Displays the 'msg' from your controller: res.status(400).json({ msg: '...' })
      setError(err.response?.data?.msg || 'Invalid Email or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Access your MedConnect account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 border border-red-100">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase ml-2">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase ml-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm font-medium">
            New here? <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-800 underline-offset-4 hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;