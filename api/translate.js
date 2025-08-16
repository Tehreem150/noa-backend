// backend/api/translate.js
import Cors from "cors";
import axios from "axios";

// Initialize CORS middleware
const cors = Cors({
  methods: ["POST", "OPTIONS"],
  origin: "https://noa-frontend-six.vercel.app", // your frontend URL
});

// Helper to run middleware in Next.js API
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run CORS
  await runMiddleware(req, res, cors);

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, sourceLang, targetLang } = req.body;

  // Validate required fields
  if (!text || !sourceLang || !targetLang) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Call LibreTranslate API
    const response = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text",
    });

    // Send translated text back
    res.status(200).json({ translatedText: response.data.translatedText });
  } catch (error) {
    console.error(
      "Translation API error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Translation failed" });
  }
}
