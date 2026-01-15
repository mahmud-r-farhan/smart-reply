import cacheManager from "../utils/cacheManager.js";
import { 
  getDefaultModel, 
  getFormatInstruction,
  isValidFormat,
  FORMATS 
} from "../utils/modelSelector.js";

// Reusable API caller with retry logic and caching
const callOpenRouter = async (prompt, model, retries = 2) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("API key not configured");
  }

  // Check cache first
  const cacheKey = cacheManager.generateKey(prompt, model);
  const cached = cacheManager.get(cacheKey);
  if (cached) {
    console.log("Cache hit for prompt");
    return cached;
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

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
        
        // Don't retry on auth errors
        if (response.status === 401 || response.status === 403) {
          throw new Error(`OpenRouter API error: ${response.statusText}`);
        }
        
        // Retry on server errors
        if (response.status >= 500 && attempt < retries) {
          lastError = new Error(`OpenRouter API error: ${response.statusText}`);
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); // Exponential backoff
          continue;
        }
        throw lastError || new Error(`OpenRouter API error: ${response.statusText}`);
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

      // Cache successful result
      cacheManager.set(cacheKey, result);
      return result;

    } catch (error) {
      lastError = error;
      if (error.name === "AbortError") {
        throw new Error("OpenRouter request timed out");
      }
      
      // If it's the last retry, throw the error
      if (attempt === retries) {
        console.error("OpenRouter service error after retries:", error);
        throw error;
      }
      
      // Wait before retrying
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }

  throw lastError || new Error("Failed to get response from OpenRouter");
};


// Suggestions Generator
export const generateSuggestions = async (message, format = FORMATS.PROFESSIONAL) => {
  if (!isValidFormat(format)) {
    throw new Error(`Invalid format: ${format}. Supported: ${Object.values(FORMATS).join(", ")}`);
  }

  const formatInstruction = getFormatInstruction(format);
  const model = getDefaultModel("SUGGESTIONS");
  
  const prompt = `Generate exactly 4 smart reply suggestions for this message ${formatInstruction}.
Return ONLY a JSON array of strings.

Message: "${message}"

Format: ["reply1", "reply2", "reply3", "reply4"]`;

  return callOpenRouter(prompt, model);
};


// Enhancements Generator
export const generateEnhancements = async (text, format = FORMATS.PROFESSIONAL) => {
  if (!isValidFormat(format)) {
    throw new Error(`Invalid format: ${format}. Supported: ${Object.values(FORMATS).join(", ")}`);
  }

  const formatInstruction = getFormatInstruction(format);
  const model = getDefaultModel("ENHANCEMENTS");
  
  const prompt = `Rewrite the following text ${formatInstruction}.
Improve clarity, grammar, structure, and conciseness.
Return exactly 4 variations as a JSON array of strings.

Text: "${text}"

Format: ["v1", "v2", "v3", "v4"]`;

  return callOpenRouter(prompt, model);
};


// Translations Generator
export const generateTranslations = async (text, language, format = FORMATS.PROFESSIONAL) => {
  if (!isValidFormat(format)) {
    throw new Error(`Invalid format: ${format}. Supported: ${Object.values(FORMATS).join(", ")}`);
  }

  const formatInstruction = getFormatInstruction(format);
  const model = getDefaultModel("TRANSLATIONS");
  
  const prompt = `Translate the following text to ${language} ${formatInstruction}.
Return exactly 4 different variations.
Output ONLY a JSON array of strings.

Text: "${text}"

Format: ["t1", "t2", "t3", "t4"]`;

  return callOpenRouter(prompt, model);
};

// Export format constants for use in controllers
export { FORMATS } from "../utils/modelSelector.js";
export { isValidFormat, getAvailableFormats } from "../utils/modelSelector.js";