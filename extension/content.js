const chrome = window.chrome

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    try {
      const text = window.getSelection().toString()
      sendResponse({ text })
    } catch (e) {
      sendResponse({ text: "" })
    }
    // synchronous response
  } else if (request.action === "insertText") {
    try {
      insertTextIntoActiveField(request.text)
      // optional: reply back (not required)
      // sendResponse({ ok: true })
    } catch (e) {
      console.error("Insert failed", e)
      // sendResponse({ ok: false })
    }
  }
  // do not return true here for synchronous handlers
})

function insertTextIntoActiveField(text) {
  const activeElement = document.activeElement

  if (activeElement && (activeElement.tagName === "TEXTAREA" || activeElement.tagName === "INPUT")) {
    const start = activeElement.selectionStart ?? activeElement.value.length
    const end = activeElement.selectionEnd ?? start
    const currentValue = activeElement.value

    activeElement.value = currentValue.substring(0, start) + text + currentValue.substring(end)
    const newPos = start + text.length
    activeElement.selectionStart = activeElement.selectionEnd = newPos

    // Trigger input/change for frameworks
    activeElement.dispatchEvent(new Event("input", { bubbles: true }))
    activeElement.dispatchEvent(new Event("change", { bubbles: true }))
  } else if (activeElement && activeElement.isContentEditable) {
    // Use Selection/Range API for contentEditable elements
    const sel = window.getSelection()
    if (!sel) return
    const range = sel.getRangeAt(0)
    range.deleteContents()
    const textNode = document.createTextNode(text)
    range.insertNode(textNode)
    // Move caret after inserted text
    range.setStartAfter(textNode)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  } else {
    // If no active editable element, try to paste into focused frame or notify user
    console.warn("No active editable element to insert text into.")
  }
}
