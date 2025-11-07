import { generateEnhancements } from "../services/openRouterService.js";

export const enhanceText = async (req, res) => {
  try {
    const { text, style = "professional" } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    const enhancements = await generateEnhancements(text, style);

    res.json({ enhancements });
  } catch (error) {
    console.error("Error in enhanceText controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};