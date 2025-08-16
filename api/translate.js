import fetch from "node-fetch";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight OPTIONS
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { text, sourceLang, targetLang } = req.body;
    if (!text || !sourceLang || !targetLang)
      return res.status(400).json({ error: "Missing required fields" });

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();
    res.status(200).json({ translatedText: data.responseData.translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
