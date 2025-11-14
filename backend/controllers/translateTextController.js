import { generateTranslations } from "../services/openRouterService.js";

export const translateText = async (req, res) => {
  try {
    const { text, style = "professional", language = "english" } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    const translations = await generateTranslations(text, style, language);

    res.json({ translations });
  } catch (error) {
    console.error("Error in translateText controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};