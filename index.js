// backend/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();

    res.json({ translatedText: data.responseData.translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);
