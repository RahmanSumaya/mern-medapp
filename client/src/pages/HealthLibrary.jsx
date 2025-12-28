import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Added this
import { Search, BookOpen, ChevronRight } from 'lucide-react';

const HealthLibrary = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Initialize navigate

  // Fetch articles from backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/articles?search=${searchTerm}`);
        setArticles(res.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchArticles();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-indigo-900 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Medical Knowledge Base</h1>
        <p className="text-indigo-200 max-w-2xl mx-auto">
          Search for symptoms, diseases, and treatment guides verified by our medical professionals.
        </p>

        <div className="max-w-xl mx-auto mt-8 relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search disease (e.g. Diabetes, Flu...)" 
            className="w-full p-4 pl-12 rounded-2xl text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/30"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="text-center py-20">Loading articles...</div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article._id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="h-48 bg-slate-200 relative">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><BookOpen size={40} /></div>
                  )}
                  <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {article.diseaseName}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-6">
                    {article.content}
                  </p>
                  
                  <button 
                    onClick={() => navigate(`/article/${article._id}`)} 
                    className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-3 transition-all"
                  >
                    Read Full Article <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">No articles found matching your search.</div>
        )}
      </div>
    </div>
  );
};

export default HealthLibrary;