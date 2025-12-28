const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Re-initialize inside the function to ensure ENV is fresh
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 2. Try the stable model name
    // If 'gemini-1.5-flash' fails, the library might be looking for 'models/gemini-1.5-flash'
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful medical assistant for a doctor's dashboard. 
    Answer the following query professionally: ${message}`;

    // 3. Simple generate call
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ reply: text });

  } catch (error) {
    console.error("DEBUG - Gemini Error:", error);
    
    // If it's still 404, the error is likely the model string
    return res.status(500).json({ 
      msg: "AI is currently unavailable", 
      error: error.message 
    });
  }
};