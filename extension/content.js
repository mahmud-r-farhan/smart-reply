const api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === "getSelectedText") {
      sendResponse({ text: window.getSelection()?.toString().trim() || "" });
    } else if (request.action === "insertText") {
      const success = insertIntoActiveElement(request.text);
      sendResponse({ success });
    }
  } catch (err) {
    sendResponse({ error: err.message });
  }
  return true;
});

function insertIntoActiveElement(text) {
  const el = document.activeElement;
  if (!el) return false;

  try {
    if (el.isContentEditable) {
      document.execCommand("insertText", false, text);
      return true;
    }

    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const value = el.value;
      el.value = value.slice(0, start) + text + value.slice(end);
      el.selectionStart = el.selectionEnd = start + text.length;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    }
  } catch (err) {
    console.error("Insert error:", err);
    return false;
  }

  return false;
}