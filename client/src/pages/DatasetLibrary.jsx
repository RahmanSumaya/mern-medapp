import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, Search, FileText, ExternalLink, Database } from "lucide-react";

const DatasetLibrary = () => {
  const [dataset, setDataset] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPublicDataset = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dataset/public_dataset");
        setDataset(res.data);
      } catch (err) {
        console.error("Error fetching datasets", err);
      }
    };
    fetchPublicDataset();
  }, []);

  const filteredDataset = dataset.filter((ds) =>
    ds.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ds.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCount = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/dataset/download-hit/${id}`);
    } catch (err) {
      console.error("Download count failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
              <Database size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">Hospital Dataset Library</h1>
          <p className="text-slate-500 mt-3 text-lg">Verified medical research and health data records.</p>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search datasets (e.g. 'COVID', 'Heart', '2024')..." 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDataset.map((ds) => (
            <div key={ds._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  Admin Verified
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">{ds.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                {ds.description || "No description provided for this dataset."}
              </p>
              
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="text-xs text-slate-400">
                  By <span className="font-semibold text-slate-600">Dr. {ds.doctor?.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                   Downloads: {ds.downloadCount || 0}
                </div>
              </div>

              <a 
                href={`http://localhost:5000/${ds.fileUrl}`} 
                onClick={() => handleDownloadCount(ds._id)}
                download 
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition shadow-lg shadow-indigo-100"
              >
                <Download size={18} /> Download Dataset
              </a>
            </div>
          ))}
        </div>
        
        {filteredDataset.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-slate-300 mb-4"><Database size={64} /></div>
            <p className="text-slate-400 text-lg">No verified datasets found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetLibrary;