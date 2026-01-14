import { generateSuggestions } from "../services/openRouterService.js";

export const suggestReply = async (req, res, next) => {
  try {
    const { message, style = "professional" } = req.body;

    // Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: "Message must be under 2000 characters" });
    }
    if (!/^[a-zA-Z\s\-]+$/.test(style)) {
      return res.status(400).json({ error: "Invalid style" });
    }

    const suggestions = await generateSuggestions(message.trim(), style);
    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
};