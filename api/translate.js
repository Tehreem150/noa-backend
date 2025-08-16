import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, sourceLang, targetLang } = req.body;

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();

    res.status(200).json({ translatedText: data.responseData.translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
