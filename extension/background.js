const api = typeof browser !== 'undefined' ? browser : chrome;

// Message listener
api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getResults") {
    fetchResults(request.input, request.style, request.mode, request.to_lang)
      .then(results => sendResponse({ results }))
      .catch(err => sendResponse({ error: err.message || "Request failed" }));
    return true;
  }
});

async function fetchResults(input, style, mode, to_lang) {
  try {
    const storage = await api.storage.sync.get("backendUrl");
    const backendUrl = storage.backendUrl || "http://localhost:5006/api";
    const baseUrl = backendUrl.replace(/\/$/, "");

    const endpoints = {
      reply: "/suggest-reply",
      enhance: "/enhance-text",
      translate: "/translate-text"
    };

    const body = mode === "translate"
      ? { text: input, language: to_lang }
      : { [mode === "enhance" ? "text" : "message"]: input, style };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(`${baseUrl}${endpoints[mode]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      return mode === "reply" ? data.suggestions
           : mode === "enhance" ? data.enhancements
           : data.translations || [];
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") throw new Error("Request timed out");
      throw err;
    }
  } catch (err) {
    throw new Error(err.message || "Failed to fetch results");
  }
}

// Context Menu initialization
function initContextMenu() {
  try {
    api.contextMenus.create({
      id: "instant-translate",
      title: "Translate with Instant Write",
      contexts: ["selection"]
    });

    api.contextMenus.onClicked.addListener(async (info, tab) => {
      if (info.menuItemId === "instant-translate" && info.selectionText) {
        await api.storage.local.set({
          pendingAction: { mode: "translate", input: info.selectionText }
        });
        try {
          await api.action.openPopup();
        } catch (e) {
          console.log("openPopup not available in this context");
        }
      }
    });
  } catch (e) {
    console.error("Context menu error:", e);
  }
}

// Commands initialization
function initCommands() {
  if (api.commands) {
    api.commands.onCommand.addListener(async (command) => {
      if (command === "translate-selected") {
        try {
          const [tab] = await api.tabs.query({ active: true, currentWindow: true });
          if (!tab) return;
          
          const result = await api.tabs.sendMessage(tab.id, { action: "getSelectedText" });
          if (result?.text) {
            await api.storage.local.set({
              pendingAction: { mode: "translate", input: result.text }
            });
            try {
              await api.action.openPopup();
            } catch (e) {
              console.log("openPopup not available in this context");
            }
          }
        } catch (err) {
          console.error("Command error:", err);
        }
      }
    });
  }
}

// Initialize on load
initContextMenu();
initCommands();