const express = require('express');
const router = express.Router();
const axios = require('axios');
const Chat = require('../models/Chat');
const { protect, authorize } = require('../middleware/authMiddleware');


// GET: Load chat history for the logged-in user
router.get("/history", protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user.id });
    res.json(chat ? chat.messages : []);
  } catch (err) {
    res.status(500).json({ message: "Error loading history" });
  }
});

// POST: Send message and save to history
router.post("/chat", protect, async (req, res) => {
  const { userMessage } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  try {
    // 1. Get AI Response from Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        systemInstruction: {
          parts: [{ text: "You are Sumatsina AI, a professional medical assistant. Provide concise, helpful health advice and suggest booking appointments on our platform." }],
        },
      }
    );

    const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm offline.";

    // 2. Save both messages to MongoDB
    let chat = await Chat.findOne({ userId: req.user.id });
    
    if (!chat) {
      chat = new Chat({ userId: req.user.id, messages: [] });
    }

    chat.messages.push(
      { role: 'user', text: userMessage },
      { role: 'bot', text: botReply }
    );

    await chat.save();
    res.json({ reply: botReply });

  } catch (error) {
    console.error("Gemini Details:", error.response?.data || error.message);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

module.exports = router;