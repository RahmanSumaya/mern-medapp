const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful medical assistant for a doctor's dashboard. 
    Answer the following query professionally: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ reply: text });

  } catch (error) {
    console.error("DEBUG - Gemini Error:", error);
    
    return res.status(500).json({ 
      msg: "AI is currently unavailable", 
      error: error.message 
    });
  }
};