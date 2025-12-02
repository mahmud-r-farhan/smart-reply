// New Model (Grok 4.1)
const MODEL = "x-ai/grok-4.1-fast:free";
// Old models (commented out):
// const SUGGESTIONS_ENHANCEMENTS_MODEL = "meta-llama/llama-3.1-8b-instruct";
// const TRANSLATIONS_MODEL = "qwen/qwen-2.5-7b-instruct";

// Reusable function to call OpenRouter API and parse the response
const callOpenRouter = async (prompt, model = MODEL) => {
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
    const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";

    let result = [];
    try {
      result = JSON.parse(content);
      if (!Array.isArray(result)) throw new Error("Not an array");
    } catch (e) {
      try {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          result = JSON.parse(match[0]);
        } else {
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

export const generateSuggestions = async (message, style) => {
  const prompt = `Generate 4 smart reply suggestions for the following message in a ${style} tone. Return ONLY a JSON array of strings with no preamble.

Message: "${message}"

Return format: ["reply1", "reply2", "reply3", "reply4"]`;

  return callOpenRouter(prompt);
};

export const generateEnhancements = async (text, style) => {
  const prompt = `You are a professional text editor. Rewrite the following text in a ${style} tone, improving grammar, clarity, conciseness, and structure. Generate exactly 4 distinct variations. Return ONLY a JSON array of strings with no preamble or explanation.

Text: "${text}"

Return format: ["enhanced1", "enhanced2", "enhanced3", "enhanced4"]`;

  return callOpenRouter(prompt);
};

export const generateTranslations = async (text, style, language) => {
  const prompt = `Translate the following text to ${language} in a ${style} tone. Generate exactly 4 distinct variations. Return ONLY a JSON array of strings with no preamble or explanation.

Text: "${text}"

Return format: ["translation1", "translation2", "translation3", "translation4"]`;

  return callOpenRouter(prompt);
};