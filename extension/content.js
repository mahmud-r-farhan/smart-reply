chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    try {
      const text = window.getSelection().toString();
      sendResponse({ text });
    } catch (e) {
      sendResponse({ text: "" });
    }
  } else if (request.action === "insertText") {
    try {
      insertTextIntoActiveField(request.text);
    } catch (e) {
      console.error("Insert failed", e);
    }
  }
});

function insertTextIntoActiveField(text) {
  const activeElement = document.activeElement;

  if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
    const start = activeElement.selectionStart ?? activeElement.value.length;
    const end = activeElement.selectionEnd ?? start;
    const currentValue = activeElement.value;

    activeElement.value = currentValue.substring(0, start) + text + currentValue.substring(end);
    const newPos = start + text.length;
    activeElement.selectionStart = activeElement.selectionEnd = newPos;

    activeElement.dispatchEvent(new Event("input", { bubbles: true }));
    activeElement.dispatchEvent(new Event("change", { bubbles: true }));
  } else if (activeElement && activeElement.isContentEditable) {
    const sel = window.getSelection();
    if (!sel) return;
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    console.warn("No active editable element to insert text into.");
  }
}