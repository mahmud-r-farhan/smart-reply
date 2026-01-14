import { create } from "zustand";

// Config for API endpoints and modes
const ENDPOINT_CONFIG = {
  reply: { url: "/suggest-reply", key: "suggestions", bodyKey: "message" },
  enhance: { url: "/enhance-text", key: "enhancements", bodyKey: "text" },
  translate: { url: "/translate-text", key: "translations", bodyKey: "text" },
};

export const useChatStore = create((set, get) => {
  let abortController = null;

  return {
    input: "",
    results: [],
    loading: false,
    style: "professional",
    mode: "reply",
    language: "english",
    error: null,

    setInput: (val) => set({ input: val }),
    setStyle: (sty) => set({ style: sty }),
    setMode: (m) => set({ mode: m, results: [], error: null }),
    setLanguage: (lang) => set({ language: lang }),
    clear: () => set({ input: "", results: [], error: null }),

    getResults: async () => {
      const state = get();

      // Cancel previous request if still pending
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();

      set({ loading: true, results: [], error: null });
      
      try {
        const config = ENDPOINT_CONFIG[state.mode] || ENDPOINT_CONFIG.reply;
        const body = {
          [config.bodyKey]: state.input,
          style: state.style,
        };

        if (state.mode === "translate") {
          body.language = state.language;
        }

        const res = await fetch(import.meta.env.VITE_API_ENDPOINT + config.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: abortController.signal,
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        const results = data[config.key] || [];

        set({ results, error: null });
      } catch (err) {
        if (err.name !== "AbortError") {
          set({ error: err.message, results: [] });
        }
      } finally {
        set({ loading: false });
      }
    },

    // Cancel ongoing request
    cancelRequest: () => {
      if (abortController) {
        abortController.abort();
        abortController = null;
        set({ loading: false });
      }
    },
  };
});