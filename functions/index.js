const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// We will use the native fetch API available in Node.js 18+ 
// to communicate with Google's Gemini API.

exports.chat = onRequest({ cors: true }, async (req, res) => {
  // Access the API key from environment variables
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    logger.error("GEMINI_API_KEY is not set.");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const body = req.body;
    const { contents, system_instruction, generationConfig, tools } = body;

    const geminiBody = {
      system_instruction,
      contents,
      generationConfig,
      tools
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody)
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error("Gemini API Error", data);
      return res.status(response.status).json(data);
    }

    res.json(data);

  } catch (error) {
    logger.error("Function Error", error);
    res.status(500).json({ error: error.message });
  }
});
