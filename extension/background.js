try {
  chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 });
} catch (e) {
  console.error('Failed to create keep-alive alarm:', e);
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('Service worker keep-alive tick');
  }
});

// Ensure listener is registered immediately
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
    try {
      chrome.storage.sync.get({ backendUrl: "http://localhost:5006/api" }, res);
    } catch (e) {
      res({ backendUrl: "http://localhost:5006/api" });
    }
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
    clearTimeout(timeout);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Try again.");
    }
    throw error;
  }
}

// Initialize context menu and handlers
function initializeContextMenu() {
  try {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'translate-selected',
        title: 'Translate Selected Text',
        contexts: ['selection']
      });
    });
  } catch (e) {
    console.error('Context menu initialization error:', e);
  }
}

// Call initialization on startup
initializeContextMenu();

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-selected') {
    const selectedText = info.selectionText || '';
    if (selectedText) {
      // Store the pending action without waiting for content script
      chrome.storage.local.set({
        pendingAction: {
          mode: 'translate',
          input: selectedText
        }
      }).then(() => {
        // Open popup after storing data
        chrome.action.openPopup();
      }).catch((error) => {
        console.error('Storage error:', error);
        // Still try to open popup even if storage fails
        chrome.action.openPopup();
      });
    }
  }
});

// Handle commands
chrome.commands.onCommand.addListener((command) => {
  if (command === 'translate-selected') {
    // For keyboard shortcut, we need to get selected text from content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        // Try to get selected text, but don't fail if content script isn't available
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'getSelectedText' },
          { frameId: 0 }
        ).then((result) => {
          const selectedText = result?.text || '';
          if (selectedText) {
            chrome.storage.local.set({
              pendingAction: {
                mode: 'translate',
                input: selectedText
              }
            }).then(() => {
              chrome.action.openPopup();
            });
          } else {
            // No text selected, just open popup
            chrome.action.openPopup();
          }
        }).catch(() => {
          // Content script not available, just open popup
          chrome.action.openPopup();
        });
      }
    });
  }
});