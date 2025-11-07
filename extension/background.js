chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getResults") {
    fetchResults(request.input, request.style, request.mode)
      .then((results) => {
        sendResponse({ results });
      })
      .catch((err) => {
        sendResponse({ error: err.message || "Failed to fetch results" });
      });
    return true;
  }
});

async function fetchResults(input, style, mode) {
  const cfg = await new Promise((res) => {
    chrome.storage.sync.get({ backendUrl: "http://localhost:5006/api" }, res);
  });
  const baseUrl = cfg?.backendUrl || "http://localhost:5006/api";

  let endpoint = "/suggest-reply";
  let body = { message: input, style };
  if (mode === "enhance") {
    endpoint = "/enhance-text";
    body = { text: input, style };
  }

  const url = `${baseUrl}${endpoint}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Backend error: ${response.status} ${response.statusText} - ${text}`);
    }

    const data = await response.json();
    return (mode === "reply" ? data.suggestions : data.enhancements) || [];
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Try again.");
    }
    throw error;
  }
}