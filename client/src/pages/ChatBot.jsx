import React, { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = { role: "user", text: input };
    setMessages([...messages, userMsg]);

    try {
      const token = localStorage.getItem('token');
       const res = await axios.post('http://localhost:5000/api/chat/ask',
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages((prev) => [...prev, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Error connecting to AI." }]);
    }
    setInput("");
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
      <h3>Medical AI Assistant</h3>
      <div style={{ height: '200px', overflowY: 'scroll', marginBottom: '10px' }}>
        {messages.map((m, i) => (
          <p key={i}><strong>{m.role === 'user' ? 'You' : 'Gemini'}:</strong> {m.text}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Gemini..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBot;