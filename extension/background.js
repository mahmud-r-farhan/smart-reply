chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getResults") {
    fetchResults(request.input, request.style, request.mode, request.from_lang, request.to_lang)
      .then((results) => {
        sendResponse({ results });
      })
      .catch((err) => {
        sendResponse({ error: err.message || "Failed to fetch results" });
      });
    return true;
  }
});

async function fetchResults(input, style, mode, from_lang, to_lang) {
  const cfg = await new Promise((res) => {
    chrome.storage.sync.get({ backendUrl: "http://localhost:5006/api" }, res);
  });
  const baseUrl = cfg?.backendUrl || "http://localhost:5006/api";

  let endpoint = "/suggest-reply";
  let body = { message: input, style };
  if (mode === "enhance") {
    endpoint = "/enhance-text";
    body = { text: input, style };
  } else if (mode === "translate") {
    endpoint = "/translate-text";
    body = { text: input, style, language: to_lang };
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
    return (mode === "reply" ? data.suggestions : mode === "enhance" ? data.enhancements : data.translations) || [];
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Try again.");
    }
    throw error;
  }
}

// Add context menu
chrome.contextMenus.create({
  id: 'translate-selected',
  title: 'Translate Selected Text',
  contexts: ['selection']
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'translate-selected') {
    const result = await chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' });
    const selectedText = result?.text || '';
    if (selectedText) {
      await chrome.storage.local.set({
        pendingAction: {
          mode: 'translate',
          input: selectedText
        }
      });
      await chrome.action.openPopup();
    }
  }
});

// Handle commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'translate-selected') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      const result = await chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' });
      const selectedText = result?.text || '';
      if (selectedText) {
        await chrome.storage.local.set({
          pendingAction: {
            mode: 'translate',
            input: selectedText
          }
        });
        await chrome.action.openPopup();
      }
    }
  }
});