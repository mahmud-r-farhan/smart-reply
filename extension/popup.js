const defaultBackendUrl = "http://localhost:5006/api/suggest-reply"

// View elements
const mainView = document.getElementById("mainView")
const settingsView = document.getElementById("settingsView")
const formBody = document.getElementById("formBody")

// Main view elements
const messageInput = document.getElementById("messageInput")
const styleSelect = document.getElementById("styleSelect")
const generateBtn = document.getElementById("generateBtn")
const settingsBtn = document.getElementById("settingsBtn")
const container = document.getElementById("suggestionsContainer")

// Settings view elements
const backBtn = document.getElementById("backBtn")
const backendUrlInput = document.getElementById("backendUrlInput")
const saveBtn = document.getElementById("saveBtn")

// --- SVGs for UI ---
const spinnerIcon = `
  <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
`
const copyIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876V4.5c0-.621-.504-1.125-1.125-1.125H7.875c-.621 0-1.125.504-1.125 1.125v.375m11.25 12.875-2.25-2.25" />
  </svg>
`
const insertIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
`

// --- Initialization ---
async function initPopup() {
  generateBtn.addEventListener("click", generateSuggestions)
  settingsBtn.addEventListener("click", openSettings)
  backBtn.addEventListener("click", closeSettings)
  saveBtn.addEventListener("click", saveSettings)
  loadSettings()

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab) {
      const selectedText = await getSelectedText(tab.id)
      messageInput.value = selectedText || ""
    }
  } catch (error) {
    console.warn("Could not query tabs or get selected text:", error.message)
  }
}

async function getSelectedText(tabId) {
  try {
    const result = await chrome.tabs.sendMessage(tabId, { action: "getSelectedText" })
    return result?.text || ""
  } catch (error) {
    console.log("Could not get selected text:", error.message)
    return ""
  }
}

// --- View Switching ---
function openSettings() {
  mainView.classList.add("hidden-view")
  settingsView.classList.remove("hidden-view")
}

function closeSettings() {
  settingsView.classList.add("hidden-view")
  mainView.classList.remove("hidden-view")
}

// --- Settings Logic ---
async function loadSettings() {
  const cfg = await chrome.storage.sync.get({ backendUrl: defaultBackendUrl })
  backendUrlInput.value = cfg.backendUrl
}

async function saveSettings() {
  const newUrl = backendUrlInput.value.trim() || defaultBackendUrl
  await chrome.storage.sync.set({ backendUrl: newUrl })
  backendUrlInput.value = newUrl
  closeSettings()
}

// --- Core App Logic ---
async function generateSuggestions() {
  const message = messageInput.value.trim()
  const style = styleSelect.value

  if (!message) {
    alert("Please enter a message.")
    return
  }

  // --- Loading UI State ---
  generateBtn.disabled = true
  formBody.disabled = true
  generateBtn.innerHTML = `${spinnerIcon} Generating...`
  container.innerHTML = ""

  try {
    const response = await chrome.runtime.sendMessage({
      action: "getSuggestions",
      message,
      style,
    })

    if (response?.suggestions && response.suggestions.length > 0) {
      displaySuggestions(response.suggestions)
    } else if (response?.error) {
      container.innerHTML = `<div class="error-box"><b>Error:</b> ${escapeHtml(response.error)}</div>`
    } else {
      container.innerHTML = '<p>No suggestions generated. Try again.</p>'
    }
  } catch (error) {
    console.error("Popup Error:", error)
    container.innerHTML = `<div class="error-box"><b>Error:</b> ${escapeHtml(error.message || String(error))}</div>`
  } finally {
    // --- Restore UI State ---
    generateBtn.disabled = false
    formBody.disabled = false
    generateBtn.innerHTML = "Generate Suggestions"
  }
}

// --- Suggestion Card Display ---
function displaySuggestions(suggestions) {
  container.innerHTML = "" 

  suggestions.forEach((suggestion, index) => {
    const div = document.createElement("div")
    div.className = "suggestion-card fade-in"
    
    const p = document.createElement("p")
    p.textContent = suggestion
    div.appendChild(p)

    const buttonGroup = document.createElement("div")
    buttonGroup.className = "card-buttons"
    
    // Copy Button
    const copyBtn = document.createElement("button")
    copyBtn.className = "btn-card btn-secondary"
    copyBtn.innerHTML = `${copyIcon} Copy`
    copyBtn.setAttribute("aria-label", `Copy suggestion ${index + 1}`)
    copyBtn.onclick = () => copySuggestion(suggestion)
    
    // Insert Button
    const insertBtn = document.createElement("button")
    insertBtn.className = "btn-card btn-primary-card"
    insertBtn.innerHTML = `${insertIcon} Insert`
    insertBtn.setAttribute("aria-label", `Insert suggestion ${index + 1}`)
    insertBtn.onclick = () => insertSuggestion(suggestion)

    buttonGroup.appendChild(copyBtn)
    buttonGroup.appendChild(insertBtn)
    div.appendChild(buttonGroup)
    container.appendChild(div)
  })
}

async function copySuggestion(text) {
  try {
    await navigator.clipboard.writeText(text)
    alert("Copied to clipboard.")
  } catch (e) {
    copySuggestionFallback(text)
  }
}

function copySuggestionFallback(text) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  try {
    document.execCommand("copy")
    alert("Copied to clipboard (fallback).")
  } catch (e) {
    alert("Copy failed.")
  } finally {
    textarea.remove()
  }
}

async function insertSuggestion(text) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab) throw new Error("No active tab found.")
    
    await chrome.tabs.sendMessage(tab.id, { action: "insertText", text })
    alert("Inserted into active field.")
  } catch (e) {
    console.error("Insert failed:", e)
    alert("Could not insert. Click in a text field first.")
  }
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Initialize on load
initPopup()