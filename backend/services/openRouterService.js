// Models
const SUGGESTIONS_MODEL = "tngtech/deepseek-r1t2-chimera:free";
const ENHANCEMENTS_MODEL = "google/gemma-3-27b-it:free";
const TRANSLATIONS_MODEL = "meta-llama/llama-3.3-70b-instruct:free";


// Reusable API caller
const callOpenRouter = async (prompt, model = SUGGESTIONS_MODEL) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("API key not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      let body = "";
      try { body = await response.text(); } catch (e) {}
      console.error("OpenRouter API error:", response.status, body);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = (data.choices?.[0]?.message?.content || "").trim();

    let result = [];

    // Try direct JSON parse
    try {
      result = JSON.parse(content);
      if (!Array.isArray(result)) throw new Error("Not an array");
    } catch (e) {
      // Try extracting JSON substring
      try {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          result = JSON.parse(match[0]);
        } else {
          // Fallback: list parsing
          result = content
            .split("\n")
            .map((l) => l.replace(/^\s*[-\d\.\)]\s*/, "").trim())
            .filter((l) => l.length > 0)
            .slice(0, 4);
        }
      } catch (e2) {
        console.error("Failed to parse response:", e2);
        result = [];
      }
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("OpenRouter request timed out");
    }
    console.error("OpenRouter service error:", error);
    throw error;
  }
};


// Suggestions Generator
export const generateSuggestions = async (message, style) => {
  const prompt = `Generate exactly 4 smart reply suggestions for this message in a ${style} tone.
Return ONLY a JSON array of strings.

Message: "${message}"

Format: ["reply1", "reply2", "reply3", "reply4"]`;

  return callOpenRouter(prompt, SUGGESTIONS_MODEL);
};


// Enhancements Generator
export const generateEnhancements = async (text, style) => {
  const prompt = `Rewrite the following text in a ${style} tone.
Improve clarity, grammar, structure, and conciseness.
Return exactly 4 variations as a JSON array of strings.

Text: "${text}"

Format: ["v1", "v2", "v3", "v4"]`;

  return callOpenRouter(prompt, ENHANCEMENTS_MODEL);
};


// Translations Generator
export const generateTranslations = async (text, style, language) => {
  const prompt = `Translate the following text to ${language} in a ${style} tone.
Return exactly 4 different variations.
Output ONLY a JSON array of strings.

Text: "${text}"

Format: ["t1", "t2", "t3", "t4"]`;

  return callOpenRouter(prompt, TRANSLATIONS_MODEL);
};