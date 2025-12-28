import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' // Default role
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connecting to your backend route
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      console.log('User Registered:', res.data);
      alert('Signup Successful! Please Login.');
      navigate('/login'); // Redirect to login after success
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h2>
        
        {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password (min 6 chars)" required
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <select 
            className="w-full p-3 border rounded-lg focus:outline-blue-500 bg-white"
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="user">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;