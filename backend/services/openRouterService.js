export const generateSuggestions = async (message, style) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("API key not configured");
  }

  const prompt = `You are a helpful AI assistant that generates smart reply suggestions. Generate exactly 4 reply suggestions to the following message in a ${style} tone. Return ONLY a JSON array of strings, no other text.

Message: "${message}"

Return format: ["reply1", "reply2", "reply3", "reply4"]`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "chrome-extension://smart-reply-assistant",
      "X-Title": "Smart Reply Assistant",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("OpenRouter API error:", errorData);
    throw new Error(errorData.error?.message || "Failed to generate suggestions");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  let suggestions = [];
  try {
    suggestions = JSON.parse(content);
  } catch (e) {
    suggestions = content
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .slice(0, 4);
  }

  return suggestions;
};