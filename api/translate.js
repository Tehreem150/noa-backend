export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight request
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse JSON body
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => { data += chunk; });
      req.on("end", () => resolve(JSON.parse(data)));
      req.on("error", err => reject(err));
    });

    const { text, sourceLang, targetLang } = body;

    if (!text || !sourceLang || !targetLang)
      return res.status(400).json({ error: "Missing required fields" });

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${sourceLang}|${targetLang}`
    );

    const dataRes = await response.json();
    res.status(200).json({ translatedText: dataRes.responseData.translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
