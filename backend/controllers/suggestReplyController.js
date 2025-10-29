import { generateSuggestions } from "../services/openRouterService.js";

export const suggestReply = async (req, res) => {
  try {
    const { message, style = "professional" } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    const suggestions = await generateSuggestions(message, style);

    res.json({ suggestions });
  } catch (error) {
    console.error("Error in suggestReply controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};