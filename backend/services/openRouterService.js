export const generateSuggestions = async (message, style) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("API key not configured");
  }

  const prompt = `You are a helpful AI assistant that generates smart reply suggestions. Generate exactly 4 reply suggestions to the following message in a ${style} tone. Return ONLY a JSON array of strings, no other text.

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
        model: "meta-llama/llama-3.1-8b-instruct:free",
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

    // Try to parse content as JSON array; if it fails, try to extract a JSON array substring
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
          // fallback: split by newlines and take non-empty lines
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