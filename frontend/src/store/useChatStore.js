import { create } from "zustand";

export const useChatStore = create((set, get) => ({
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
    set({ loading: true, results: [], error: null });
    try {
      let endpoint = "/suggest-reply";
      let body = { message: state.input, style: state.style };
      if (state.mode === "enhance") {
        endpoint = "/enhance-text";
        body = { text: state.input, style: state.style };
      } else if (state.mode === "translate") {
        endpoint = "/translate-text";
        body = { text: state.input, style: state.style, language: state.language };
      }

      const res = await fetch(import.meta.env.VITE_API_ENDPOINT + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      set({ results: (state.mode === "reply" ? data?.suggestions : state.mode === "enhance" ? data?.enhancements : data?.translations) || [] });
    } catch (err) {
      set({ error: err.message, results: [] });
    } finally {
      set({ loading: false });
    }
  },
}));