import { generateEnhancements } from "../services/openRouterService.js";

export const enhanceText = async (req, res, next) => {
  try {
    const { text, style = "professional" } = req.body;

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

    const enhancements = await generateEnhancements(text.trim(), style);
    res.json({ enhancements });
  } catch (error) {
    next(error);
  }
};