const chrome = window.chrome

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSuggestions") {
    fetchSuggestions(request.message, request.style)
      .then((suggestions) => {
        sendResponse({ suggestions })
      })
      .catch((err) => {
        console.error("Error in background fetchSuggestions:", err)
        sendResponse({ error: err.message || "Failed to fetch suggestions" })
      })
    // Indicates we will respond asynchronously
    return true
  }
})

async function fetchSuggestions(message, style) {
  const cfg = await new Promise((res) => {
    // Backend Api
    chrome.storage.sync.get({ backendUrl: "http://localhost:5006/api/suggest-reply" }, res)
  })
  const backendUrl = cfg?.backendUrl || "http://localhost:5006/api/suggest-reply"

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000) // 15s

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({ message, style }),
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Backend error: ${response.status} ${response.statusText} - ${text}`)
    }

    const data = await response.json()
    return data.suggestions || []
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Try again.")
    }
    console.error("Error fetching suggestions:", error)
    throw error
  }
}
