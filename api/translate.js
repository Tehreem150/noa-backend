import axios from "axios";
import Cors from "cors";

// Initialize CORS middleware
const cors = Cors({
  methods: ["POST", "OPTIONS"],
  origin: "https://noa-frontend-six.vercel.app", // frontend URL
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

  const { text, targetLang } = req.body;

  // Validate request body
  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Call your translation API
    const response = await axios.post(
      process.env.TRANSLATION_API_URL,
      { text, targetLang },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json", // ensure JSON
        },
      }
    );

    // Return translated text
    res.status(200).json({ translatedText: response.data.translatedText });
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Translation failed" });
  }
}
