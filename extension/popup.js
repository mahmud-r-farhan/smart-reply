// CONSTANTS & ICONS

const DEFAULT_BACKEND_URL = 'http://localhost:5006/api';
const DEFAULT_FROM_LANG = 'auto';
const DEFAULT_TO_LANG = 'english';

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


// STATE MANAGEMENT

const state = {
  mode: 'reply',
  backendUrl: DEFAULT_BACKEND_URL,
  defaultFromLang: DEFAULT_FROM_LANG,
  defaultToLang: DEFAULT_TO_LANG,
  isLoading: false
};


// UTILITY FUNCTIONS

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


// COMPONENTS

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


// CHROME/BROWSER API WRAPPERS (CROSS-BROWSER)

const api = (typeof chrome !== 'undefined' ? chrome : browser);

const chromeApi = {
  getSelectedText: async () => {
    try {
      const [tab] = await api.tabs.query({ active: true, currentWindow: true });
      if (!tab) return '';
      
      const result = await api.tabs.sendMessage(tab.id, { action: 'getSelectedText' });
      return result?.text || '';
    } catch (error) {
      return '';
    }
  },

  insertText: async (text) => {
    try {
      const [tab] = await api.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error('No active tab found');
      
      await api.tabs.sendMessage(tab.id, { action: 'insertText', text });
      return true;
    } catch (error) {
      throw new Error('Could not insert text. Make sure you click in a text field first.');
    }
  },

  loadSettings: async () => {
    const cfg = await api.storage.sync.get({ 
      backendUrl: DEFAULT_BACKEND_URL,
      defaultFromLang: DEFAULT_FROM_LANG,
      defaultToLang: DEFAULT_TO_LANG
    });
    return cfg;
  },

  saveSettings: async (settings) => {
    let { backendUrl, defaultFromLang, defaultToLang } = settings;
    backendUrl = backendUrl.trim() || DEFAULT_BACKEND_URL;
    backendUrl = backendUrl.replace(/\/$/, ''); // Remove trailing slash
    
    // Validate URL
    try {
      new URL(backendUrl);
    } catch (e) {
      throw new Error('Invalid URL. Please enter a valid URL (e.g., http://localhost:5006/api)');
    }
    
    await api.storage.sync.set({ backendUrl, defaultFromLang, defaultToLang });
    return { backendUrl, defaultFromLang, defaultToLang };
  },

  sendMessage: async (action, data) => {
    return await api.runtime.sendMessage({ action, ...data });
  }
};


// UI HANDLERS

const ui = {
  setLoading: (loading) => {
    state.isLoading = loading;
    const btn = utils.$('#generateBtn');
    let modeText = 'Generating...';
    let normalText = 'Generate Suggestions';
    if (state.mode === 'enhance') {
      modeText = 'Enhancing...';
      normalText = 'Enhance Text';
    } else if (state.mode === 'translate') {
      modeText = 'Translating...';
      normalText = 'Translate Text';
    }
    
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
    const langGroup = utils.$('#languageGroup');
    const styleGroup = utils.$('.form-group:nth-child(2)'); // Style select group
    
    langGroup.classList.add('hidden');
    styleGroup.classList.remove('hidden');
    
    if (state.mode === 'reply') {
      inputLabel.textContent = 'Message to Reply To';
      inputField.placeholder = 'Paste message or highlight text...';
      generateBtn.innerHTML = `${icons.lightning} Generate Suggestions`;
    } else if (state.mode === 'enhance') {
      inputLabel.textContent = 'Text to Enhance';
      inputField.placeholder = 'Paste your text to enhance...';
      generateBtn.innerHTML = `${icons.lightning} Enhance Text`;
    } else if (state.mode === 'translate') {
      inputLabel.textContent = 'Text to Translate';
      inputField.placeholder = 'Paste text to translate...';
      generateBtn.innerHTML = `${icons.lightning} Translate Text`;
      langGroup.classList.remove('hidden');
      styleGroup.classList.add('hidden'); // Hide style for translate, or keep if needed
    }
  }
};


// EVENT HANDLERS

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
    const toLang = utils.$('#toLangSelect').value || state.defaultToLang;

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
        mode: state.mode,
        from_lang: state.defaultFromLang, // Not used in backend, but pass if needed
        to_lang: toLang
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
    utils.$('#defaultFromLang').value = state.defaultFromLang;
    utils.$('#defaultToLang').value = state.defaultToLang;
    utils.showView('settingsView');
  },

  closeSettings: () => {
    utils.showView('mainView');
  },

  saveSettings: async () => {
    const backendUrl = utils.$('#backendUrlInput').value;
    const defaultFromLang = utils.$('#defaultFromLang').value;
    const defaultToLang = utils.$('#defaultToLang').value;
    
    try {
      const saved = await chromeApi.saveSettings({ backendUrl, defaultFromLang, defaultToLang });
      Object.assign(state, saved);
      handlers.closeSettings();
    } catch (error) {
      alert(error.message);
    }
  },

  loadSettings: async () => {
    const settings = await chromeApi.loadSettings();
    Object.assign(state, settings);
    utils.$('#backendUrlInput').value = state.backendUrl;
    utils.$('#defaultFromLang').value = state.defaultFromLang;
    utils.$('#defaultToLang').value = state.defaultToLang;
  }
};


// INITIALIZATION

const init = async () => {
  // Load settings
  await handlers.loadSettings();

  // Check for pending action (e.g., from context menu or shortcut)
  const pending = await api.storage.local.get('pendingAction');
  let handledPending = false;
  if (pending.pendingAction) {
    const { mode, input } = pending.pendingAction;
    if (mode === 'translate' && input) {
      utils.$('#inputText').value = input;
      handlers.switchMode('translate');
      utils.$('#toLangSelect').value = state.defaultToLang;
      await handlers.generate();
      handledPending = true;
    }
    await api.storage.local.remove('pendingAction');
  }

  // If no pending, try to get selected text from page
  if (!handledPending) {
    const selectedText = await chromeApi.getSelectedText();
    if (selectedText) {
      utils.$('#inputText').value = selectedText;
    }
  }

  // Mode switching
  utils.$('#modeReply').addEventListener('click', () => handlers.switchMode('reply'));
  utils.$('#modeEnhance').addEventListener('click', () => handlers.switchMode('enhance'));
  utils.$('#modeTranslate').addEventListener('click', () => handlers.switchMode('translate'));

  // Generate button
  utils.$('#generateBtn').addEventListener('click', handlers.generate);

  // Navigation
  utils.$('#settingsBtn').addEventListener('click', handlers.openSettings);
  utils.$('#backBtn').addEventListener('click', handlers.closeSettings);
  utils.$('#saveBtn').addEventListener('click', handlers.saveSettings);

  // Keyboard shortcuts in popup
  utils.$('#inputText').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handlers.generate();
    }
  });

  // Set initial mode
  if (!handledPending) {
    handlers.switchMode('reply');
  }
  
  // Show empty state if no results
  if (!handledPending) {
    ui.showResults([]);
  }
};

// Start the app
init();