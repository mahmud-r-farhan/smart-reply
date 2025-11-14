export const generateSuggestions = async (message, style) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("API key not configured");
  }

  const prompt = `Generate 4 smart reply suggestions for the following message in a ${style} tone. Return ONLY a JSON array of strings with no preamble.

Message: "${message}"

Return format: ["reply1", "reply2", "reply3", "reply4"]`;

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
        // LLM Model
        model: "meta-llama/llama-3.1-8b-instruct",
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
      let body = ""
      try { body = await response.text() } catch (e) {}
      console.error("OpenRouter API error:", response.status, body);
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";

    let suggestions = [];
    try {
      suggestions = JSON.parse(content);
      if (!Array.isArray(suggestions)) throw new Error("Not an array");
    } catch (e) {
      try {
        const match = content.match(/\[[\s\S]*\]/)
        if (match) {
          suggestions = JSON.parse(match[0])
        } else {
          suggestions = content
            .split("\n")
            .map((l) => l.replace(/^\s*[-\d\.\)]\s*/, "").trim())
            .filter((l) => l.length > 0)
            .slice(0, 4)
        }
      } catch (e2) {
        console.error("Failed to parse suggestions:", e2)
        suggestions = []
      }
    }

    return suggestions
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("OpenRouter request timed out")
    }
    console.error("OpenRouter service error:", error)
    throw error
  }
};

export const generateEnhancements = async (text, style) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("API key not configured");
  }

  const prompt = `You are a professional text editor. Rewrite the following text in a ${style} tone, improving grammar, clarity, conciseness, and structure. Generate exactly 4 distinct variations. Return ONLY a JSON array of strings with no preamble or explanation.

Text: "${text}"

Return format: ["enhanced1", "enhanced2", "enhanced3", "enhanced4"]`;

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
        model: "meta-llama/llama-3.1-8b-instruct",
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

    let enhancements = [];
    try {
      enhancements = JSON.parse(content);
      if (!Array.isArray(enhancements)) throw new Error("Not an array");
    } catch (e) {
      try {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          enhancements = JSON.parse(match[0]);
        } else {
          enhancements = content
            .split("\n")
            .map((l) => l.replace(/^\s*[-\d\.\)]\s*/, "").trim())
            .filter((l) => l.length > 0)
            .slice(0, 4);
        }
      } catch (e2) {
        console.error("Failed to parse enhancements:", e2);
        enhancements = [];
      }
    }

    return enhancements;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("OpenRouter request timed out");
    }
    console.error("OpenRouter service error:", error);
    throw error;
  }
};

export const generateTranslations = async (text, style, language) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("API key not configured");
  }

  const prompt = `Translate the following text to ${language} in a ${style} tone. Generate exactly 4 distinct variations. Return ONLY a JSON array of strings with no preamble or explanation.

Text: "${text}"

Return format: ["translation1", "translation2", "translation3", "translation4"]`;

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
        model: "qwen/qwen-2.5-7b-instruct",
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

    let translations = [];
    try {
      translations = JSON.parse(content);
      if (!Array.isArray(translations)) throw new Error("Not an array");
    } catch (e) {
      try {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          translations = JSON.parse(match[0]);
        } else {
          translations = content
            .split("\n")
            .map((l) => l.replace(/^\s*[-\d\.\)]\s*/, "").trim())
            .filter((l) => l.length > 0)
            .slice(0, 4);
        }
      } catch (e2) {
        console.error("Failed to parse translations:", e2);
        translations = [];
      }
    }

    return translations;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("OpenRouter request timed out");
    }
    console.error("OpenRouter service error:", error);
    throw error;
  }
};