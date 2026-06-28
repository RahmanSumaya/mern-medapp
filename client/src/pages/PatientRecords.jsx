import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, Trash2 } from 'lucide-react';

const PatientRecords = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    const res = await axios.get('http://localhost:5000/api/records/my-records', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setRecords(res.data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('medicalFile', file);
    formData.append('description', description);

    await axios.post('http://localhost:5000/api/records/upload', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      }
    });
    alert("Uploaded!");
    fetchRecords();
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Medical Medical Vault</h1>
      
      
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl shadow-sm border mb-8">
        <div className="flex flex-col gap-4">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="border p-2 rounded-lg" />
          <input  type="text" placeholder="Description (e.g. Blood Test Oct 2025)" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded-lg" />
          <button className="bg-indigo-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2">
            <Upload size={18}/> Upload Document
          </button>
        </div>
      </form>


      <div className="grid grid-cols-1 gap-4">
        {records.map(rec => (
          <div key={rec._id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border">
            <div className="flex items-center gap-3">
              <FileText className="text-indigo-500" />
              <div>
                <p className="font-bold">{rec.fileName}</p>
                <p className="text-xs text-slate-500">{rec.description}</p>
              </div>
            </div>
            <a href={`http://localhost:5000/${rec.filePath}`} target="_blank" className="text-indigo-600 text-sm font-bold">View File</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientRecords;