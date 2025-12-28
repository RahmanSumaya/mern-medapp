import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Activity, ShieldCheck, Stethoscope } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams(); // Gets the ID from the URL
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // We fetch the specific article by ID
        const res = await axios.get(`http://localhost:5000/api/articles`);
        // Since your current GET route returns an array, we find the specific one.
        // (Tip: Later you can make a backend route GET /api/articles/:id for better performance)
        const found = res.data.find(a => a._id === id);
        setArticle(found);
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div className="p-20 text-center text-xl font-bold text-indigo-600">Loading Article...</div>;
  if (!article) return <div className="p-20 text-center">Article not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative h-96 w-full overflow-hidden">
        <img 
          src={article.imageUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef'} 
          className="w-full h-full object-cover" 
          alt={article.title}
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10">
          <button 
            onClick={() => navigate('/library')}
            className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/40 transition"
          >
            <ArrowLeft size={18} /> Back to Library
          </button>
          <div className="max-w-4xl mx-auto w-full">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              {article.diseaseName}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">{article.title}</h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-xl text-slate-600 leading-relaxed mb-12 italic border-l-4 border-indigo-500 pl-6">
          {article.content}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Symptoms */}
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
            <h3 className="flex items-center gap-2 text-red-700 font-bold mb-4 text-lg">
              <Activity size={20} /> Symptoms
            </h3>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">
              {article.symptoms || "Consult a doctor for detailed symptoms."}
            </p>
          </div>

          {/* Prevention */}
          <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
            <h3 className="flex items-center gap-2 text-green-700 font-bold mb-4 text-lg">
              <ShieldCheck size={20} /> Prevention
            </h3>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">
              {article.prevention || "No specific prevention listed."}
            </p>
          </div>

          {/* Treatments */}
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <h3 className="flex items-center gap-2 text-blue-700 font-bold mb-4 text-lg">
              <Stethoscope size={20} /> Treatments
            </h3>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed">
              {article.treatments || "Treatments vary. Seek professional advice."}
            </p>
          </div>
        </div>

        <div className="mt-16 p-8 bg-slate-900 rounded-3xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Worried about these symptoms?</h2>
          <p className="text-slate-400 mb-6">Our specialists are available for consultation 24/7.</p>
          <button 
            onClick={() => navigate('/all-doctors')}
            className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-2xl font-bold transition-all"
          >
            Find a Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;