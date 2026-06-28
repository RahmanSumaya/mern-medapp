import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FileText, User } from 'lucide-react';

const DoctorPatientView = () => {
  const { patientId } = useParams(); 
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchPatientRecords = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/records/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRecords(res.data);
      } catch (err) { console.error("Access Denied"); }
    };
    fetchPatientRecords();
  }, [patientId]);

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-indigo-100 p-4 rounded-full text-indigo-600"><User size={30}/></div>
        <h1 className="text-2xl font-black">Patient Medical History</h1>
      </div>

      {records.length === 0 ? (
        <p className="text-slate-400 italic">No medical documents have been uploaded by this patient.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map(rec => (
            <div key={rec._id} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <FileText className="text-indigo-600 mb-3" size={32} />
              <h3 className="font-bold text-slate-800">{rec.fileName}</h3>
              <p className="text-sm text-slate-500 mb-4">{rec.description || "No description provided."}</p>
              <a 
                href={`http://localhost:5000/${rec.filePath}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest"
              >
                Download/Open File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatientView;