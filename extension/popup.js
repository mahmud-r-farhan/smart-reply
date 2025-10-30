const root = document.getElementById("root")
const chrome = window.chrome

// Initialize popup
async function initPopup() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const selectedText = tab ? await getSelectedText(tab.id) : ""
  render(selectedText)
}

async function getSelectedText(tabId) {
  try {
    const result = await chrome.tabs.sendMessage(tabId, { action: "getSelectedText" })
    return result?.text || ""
  } catch (error) {
    console.log("Could not get selected text", error)
    return ""
  }
}

function render(selectedText) {
  root.innerHTML = `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold text-slate-900">Smart Reply</h1>
        <button id="settingsBtn" class="text-slate-500 hover:text-slate-700" aria-label="Settings">
          ⚙️
        </button>
      </div>

      <!-- Message Input -->
      <div>
        <label for="messageInput" class="block text-sm font-medium text-slate-700 mb-2">Message</label>
        <textarea
          id="messageInput"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Paste or type the message you want to reply to..."
          aria-label="Message to reply to"
        ></textarea>
      </div>

      <!-- Style Selector -->
      <div>
        <label for="styleSelect" class="block text-sm font-medium text-slate-700 mb-2">Tone</label>
        <select
          id="styleSelect"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Tone"
        >
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="short">Short & Concise</option>
          <option value="descriptive">Detailed & Descriptive</option>
        </select>
      </div>

      <!-- Generate Button -->
      <button
        id="generateBtn"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        aria-live="polite"
      >
        Generate Suggestions
      </button>

      <!-- Loading State -->
      <div id="loading" class="hidden text-center py-4" role="status" aria-hidden="true">
        <div class="inline-block animate-spin">⏳</div>
        <p class="text-sm text-slate-600 mt-2">Generating suggestions...</p>
      </div>

      <!-- Suggestions Container -->
      <div id="suggestionsContainer" class="space-y-2"></div>
    </div>

    <!-- Toast -->
    <div id="toast" class="fixed bottom-4 left-1/2 transform -translate-x-1/2 hidden px-4 py-2 rounded shadow text-sm"></div>
  `

  // populate textarea safely
  const messageInput = document.getElementById("messageInput")
  messageInput.value = selectedText || ""

  // Event listeners
  document.getElementById("generateBtn").addEventListener("click", generateSuggestions)
  document.getElementById("settingsBtn").addEventListener("click", openSettings)
}

function showToast(message, type = "info", timeout = 2500) {
  const toast = document.getElementById("toast")
  toast.className = "fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow text-sm"
  if (type === "error") {
    toast.classList.add("bg-red-600", "text-white")
  } else if (type === "success") {
    toast.classList.add("bg-green-600", "text-white")
  } else {
    toast.classList.add("bg-slate-800", "text-white")
  }
  toast.textContent = message
  toast.classList.remove("hidden")
  clearTimeout(toast._timeout)
  toast._timeout = setTimeout(() => {
    toast.classList.add("hidden")
  }, timeout)
}

async function generateSuggestions() {
  const message = document.getElementById("messageInput").value.trim()
  const style = document.getElementById("styleSelect").value
  const generateBtn = document.getElementById("generateBtn")
  const loading = document.getElementById("loading")
  const container = document.getElementById("suggestionsContainer")

  if (!message) {
    showToast("Please enter a message to generate suggestions.", "error")
    return
  }

  // UI state
  generateBtn.disabled = true
  generateBtn.classList.add("opacity-60", "cursor-not-allowed")
  loading.classList.remove("hidden")
  loading.setAttribute("aria-hidden", "false")
  container.innerHTML = ""

  try {
    const response = await chrome.runtime.sendMessage({
      action: "getSuggestions",
      message,
      style,
    })

    loading.classList.add("hidden")
    loading.setAttribute("aria-hidden", "true")
    generateBtn.disabled = false
    generateBtn.classList.remove("opacity-60", "cursor-not-allowed")

    if (response?.suggestions && response.suggestions.length > 0) {
      displaySuggestions(response.suggestions)
      showToast("Suggestions generated", "success")
    } else if (response?.error) {
      container.innerHTML = `<p class="text-sm text-red-600">Error: ${escapeHtml(response.error)}</p>`
      showToast("Failed to generate suggestions", "error")
    } else {
      container.innerHTML = '<p class="text-sm text-slate-600">No suggestions generated. Try again.</p>'
      showToast("No suggestions returned", "info")
    }
  } catch (error) {
    loading.classList.add("hidden")
    generateBtn.disabled = false
    generateBtn.classList.remove("opacity-60", "cursor-not-allowed")
    container.innerHTML = `<p class="text-sm text-red-600">Error: ${escapeHtml(error.message || String(error))}</p>`
    showToast("Error generating suggestions", "error")
  }
}

function displaySuggestions(suggestions) {
  const container = document.getElementById("suggestionsContainer")
  container.innerHTML = ""

  suggestions.forEach((suggestion, index) => {
    const div = document.createElement("div")
    div.className = "fade-in p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 transition-colors"
    div.innerHTML = `
      <p class="text-sm text-slate-800 mb-2">${escapeHtml(suggestion)}</p>
      <div class="flex gap-2">
        <button class="copyBtn flex-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 px-2 rounded transition-colors" data-index="${index}" aria-label="Copy suggestion ${index + 1}">
          Copy
        </button>
        <button class="insertBtn flex-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-2 rounded transition-colors" data-index="${index}" aria-label="Insert suggestion ${index + 1}">
          Insert
        </button>
      </div>
    `
    container.appendChild(div)
  })

  // Add event listeners
  document.querySelectorAll(".copyBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(suggestions[btn.dataset.index])
        showToast("Copied to clipboard", "success")
      } catch (e) {
        // fallback
        copySuggestionFallback(suggestions[btn.dataset.index])
      }
    })
  })

  document.querySelectorAll(".insertBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await insertSuggestion(suggestions[btn.dataset.index])
        showToast("Inserted into active field", "success")
      } catch (e) {
        showToast("Could not insert into field", "error")
      }
    })
  })
}

function copySuggestionFallback(text) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  try {
    document.execCommand("copy")
    showToast("Copied to clipboard", "success")
  } catch (e) {
    showToast("Copy failed", "error")
  } finally {
    textarea.remove()
  }
}

async function insertSuggestion(text) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: "insertText", text }, (resp) => {
      // content script may not reply; assume success
      resolve(true)
    })
    // don't wait for response; content script will handle insertion
  })
}

function openSettings() {
  showToast("Settings coming soon!", "info")
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Initialize on load
initPopup()
