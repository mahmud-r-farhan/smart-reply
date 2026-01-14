import { generateTranslations } from "../services/openRouterService.js";

export const translateText = async (req, res, next) => {
  try {
    const { text, style = "professional", language = "english" } = req.body;

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }
    if (text.length > 2000) {
      return res.status(400).json({ error: "Text must be under 2000 characters" });
    }
    if (!/^[a-zA-Z\s\-]+$/.test(style)) {
      return res.status(400).json({ error: "Invalid style" });
    }
    if (!/^[a-zA-Z\s\-]+$/.test(language)) {
      return res.status(400).json({ error: "Invalid language" });
    }

    const translations = await generateTranslations(text.trim(), style, language);
    res.json({ translations });
  } catch (error) {
    next(error);
  }
};