// ============================================
// CONSTANTS & ICONS
// ============================================
const DEFAULT_BACKEND_URL = 'http://localhost:5006/api';

const icons = {
  spinner: `<svg class="icon icon-sm spinner" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
    <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
  
  copy: `<svg class="icon icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>`,
  
  insert: `<svg class="icon icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>`,
  
  check: `<svg class="icon icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
  </svg>`,
  
  lightning: `<svg class="icon icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>`
};

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
  mode: 'reply',
  backendUrl: DEFAULT_BACKEND_URL,
  isLoading: false
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const utils = {
  $: (selector) => document.querySelector(selector),
  $$: (selector) => document.querySelectorAll(selector),
  
  showView: (viewId) => {
    utils.$$('.view').forEach(v => v.classList.remove('active'));
    utils.$(`#${viewId}`).classList.add('active');
  },

  escapeHtml: (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback method
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const success = document.execCommand('copy');
        textarea.remove();
        return success;
      } catch (e) {
        textarea.remove();
        return false;
      }
    }
  }
};

// ============================================
// COMPONENTS
// ============================================
const components = {
  errorAlert: (message) => `
    <div class="alert alert-error">
      <strong>Error:</strong> ${utils.escapeHtml(message)}
    </div>
  `,

  suggestionCard: (text, index) => {
    const escapedText = utils.escapeHtml(text);
    return `
      <div class="card" data-index="${index}">
        <p class="card-text">${escapedText}</p>
        <div class="card-actions">
          <button class="btn btn-secondary btn-sm copy-btn" data-index="${index}">
            ${icons.copy}
            Copy
          </button>
          <button class="btn btn-primary btn-sm insert-btn" data-index="${index}">
            ${icons.insert}
            Insert
          </button>
        </div>
      </div>
    `;
  },

  emptyState: () => `
    <div class="empty-state">
      <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <p class="empty-text">Enter a message above and click<br>"Generate Suggestions" to get started</p>
    </div>
  `
};

// ============================================
// CHROME API WRAPPERS
// ============================================
const chromeApi = {
  getSelectedText: async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return '';
      
      const result = await chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' });
      return result?.text || '';
    } catch (error) {
      return '';
    }
  },

  insertText: async (text) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error('No active tab found');
      
      await chrome.tabs.sendMessage(tab.id, { action: 'insertText', text });
      return true;
    } catch (error) {
      throw new Error('Could not insert text. Make sure you click in a text field first.');
    }
  },

  loadSettings: async () => {
    const cfg = await chrome.storage.sync.get({ backendUrl: DEFAULT_BACKEND_URL });
    return cfg.backendUrl;
  },

  saveSettings: async (backendUrl) => {
    let url = backendUrl.trim() || DEFAULT_BACKEND_URL;
    url = url.replace(/\/$/, ''); // Remove trailing slash
    
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      throw new Error('Invalid URL. Please enter a valid URL (e.g., http://localhost:5006/api)');
    }
    
    await chrome.storage.sync.set({ backendUrl: url });
    return url;
  },

  sendMessage: async (action, data) => {
    return await chrome.runtime.sendMessage({ action, ...data });
  }
};

// ============================================
// UI HANDLERS
// ============================================
const ui = {
  setLoading: (loading) => {
    state.isLoading = loading;
    const btn = utils.$('#generateBtn');
    const modeText = state.mode === 'reply' ? 'Generating...' : 'Enhancing...';
    const normalText = state.mode === 'reply' ? 'Generate Suggestions' : 'Enhance Text';
    
    btn.disabled = loading;
    btn.innerHTML = loading 
      ? `${icons.spinner} ${modeText}`
      : `${icons.lightning} ${normalText}`;
  },

  showResults: (results) => {
    const container = utils.$('#resultsContainer');
    
    if (!results || results.length === 0) {
      container.innerHTML = '<p class="text-secondary text-sm" style="text-align: center; padding: 20px;">No results generated. Please try again.</p>';
      return;
    }

    container.innerHTML = results.map((text, index) => 
      components.suggestionCard(text, index)
    ).join('');

    // Store results in closure for event handlers
    const resultTexts = results;

    // Attach copy button listeners
    utils.$$('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        const text = resultTexts[index];
        const success = await utils.copyToClipboard(text);
        
        if (success) {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `${icons.check} Copied!`;
          btn.disabled = true;
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
          }, 2000);
        }
      });
    });

    // Attach insert button listeners
    utils.$$('.insert-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        const text = resultTexts[index];
        
        try {
          await chromeApi.insertText(text);
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `${icons.check} Inserted!`;
          btn.disabled = true;
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
          }, 2000);
        } catch (error) {
          alert(error.message);
        }
      });
    });
  },

  showError: (message) => {
    const container = utils.$('#resultsContainer');
    container.innerHTML = components.errorAlert(message);
  },

  updateModeUI: () => {
    const inputLabel = utils.$('#inputLabel');
    const inputField = utils.$('#inputText');
    const generateBtn = utils.$('#generateBtn');
    
    if (state.mode === 'reply') {
      inputLabel.textContent = 'Message to Reply To';
      inputField.placeholder = 'Paste message or highlight text...';
      generateBtn.innerHTML = `${icons.lightning} Generate Suggestions`;
    } else {
      inputLabel.textContent = 'Text to Enhance';
      inputField.placeholder = 'Paste your text to enhance...';
      generateBtn.innerHTML = `${icons.lightning} Enhance Text`;
    }
  }
};

// ============================================
// EVENT HANDLERS
// ============================================
const handlers = {
  switchMode: (mode) => {
    state.mode = mode;
    utils.$$('.tab').forEach(tab => tab.classList.remove('active'));
    utils.$(`#mode${mode.charAt(0).toUpperCase() + mode.slice(1)}`).classList.add('active');
    ui.updateModeUI();
    utils.$('#resultsContainer').innerHTML = components.emptyState();
  },

  generate: async () => {
    const inputText = utils.$('#inputText').value.trim();
    const style = utils.$('#styleSelect').value;

    if (!inputText) {
      ui.showError('Please enter some text first');
      return;
    }

    ui.setLoading(true);
    utils.$('#resultsContainer').innerHTML = '';

    try {
      const response = await chromeApi.sendMessage('getResults', {
        input: inputText,
        style: style,
        mode: state.mode
      });

      if (response?.results && response.results.length > 0) {
        ui.showResults(response.results);
      } else if (response?.error) {
        ui.showError(response.error);
      } else {
        ui.showResults([]);
      }
    } catch (error) {
      ui.showError(error.message || 'An unexpected error occurred');
    } finally {
      ui.setLoading(false);
    }
  },

  openSettings: () => {
    utils.$('#backendUrlInput').value = state.backendUrl;
    utils.showView('settingsView');
  },

  closeSettings: () => {
    utils.showView('mainView');
  },

  saveSettings: async () => {
    const url = utils.$('#backendUrlInput').value;
    
    try {
      const savedUrl = await chromeApi.saveSettings(url);
      state.backendUrl = savedUrl;
      handlers.closeSettings();
    } catch (error) {
      alert(error.message);
    }
  },

  loadSettings: async () => {
    const url = await chromeApi.loadSettings();
    state.backendUrl = url;
    utils.$('#backendUrlInput').value = url;
  }
};

// ============================================
// INITIALIZATION
// ============================================
const init = async () => {
  // Load settings
  await handlers.loadSettings();

  // Try to get selected text from page
  const selectedText = await chromeApi.getSelectedText();
  if (selectedText) {
    utils.$('#inputText').value = selectedText;
  }

  // Mode switching
  utils.$('#modeReply').addEventListener('click', () => handlers.switchMode('reply'));
  utils.$('#modeEnhance').addEventListener('click', () => handlers.switchMode('enhance'));

  // Generate button
  utils.$('#generateBtn').addEventListener('click', handlers.generate);

  // Navigation
  utils.$('#settingsBtn').addEventListener('click', handlers.openSettings);
  utils.$('#backBtn').addEventListener('click', handlers.closeSettings);
  utils.$('#saveBtn').addEventListener('click', handlers.saveSettings);

  // Keyboard shortcuts
  utils.$('#inputText').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handlers.generate();
    }
  });

  // Set initial mode
  handlers.switchMode('reply');
  
  // Show empty state
  ui.showResults([]);
};

// Start the app
init();