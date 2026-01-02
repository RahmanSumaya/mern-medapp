import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, X, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const token = localStorage.getItem('token');

  // Load history when opening chat
  useEffect(() => {
    if (isOpen && token) {
      const fetchHistory = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/chat/history', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.length > 0) setMessages(res.data);
          else setMessages([{ role: 'bot', text: 'Welcome back! How can I help you today?' }]);
        } catch (err) { console.error("History failed"); }
      };
      fetchHistory();
    }
  }, [isOpen, token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !token) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat/chat', 
        { userMessage: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Session expired. Please login again." }]);
    } finally {
      setLoading(false);
    }
  };

  // If no token, don't show the chatbot at all
  if (!token) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl">
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden h-[500px]">
          <div className="bg-indigo-600 p-4 text-white font-bold flex items-center gap-2">
            <Bot size={20} /> Sumatsina AI Assistant
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask about your health..." 
              className="flex-1 bg-slate-100 p-2 rounded-xl outline-none" 
            />
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;