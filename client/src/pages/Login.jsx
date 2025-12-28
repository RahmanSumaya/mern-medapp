import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Save the token and user role to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      
      alert('Login Successful!');
      
      // Redirect based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/'); // Go home for now
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Welcome Back</h2>
        
        {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-3 border rounded-lg focus:outline-indigo-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-3 border rounded-lg focus:outline-indigo-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;