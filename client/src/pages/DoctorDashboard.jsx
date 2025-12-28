import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Make sure this URL matches your backend exactly
        const res = await axios.get('http://localhost:5000/api/auth/doctor/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.msg || "Failed to load dashboard");
      }
    };
    fetchData();
  }, []);

  // 1. Check for errors
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  // 2. Check for loading (This prevents the white screen!)
  if (!data) return <div>Loading Doctor Dashboard...</div>;

  // 3. Render once data exists
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dr. {data.name}'s Dashboard</h1>
      <div className="profile-info">
        <img src={data.profilePic} alt="Profile" style={{width: '100px'}} />
        <p><strong>Specialization:</strong> {data.specialization || 'General'}</p>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Hourly Rate:</strong> ${data.hourlyRate}</p>
      </div>
    </div>
  );
};

export default DoctorDashboard;