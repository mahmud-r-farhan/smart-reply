import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  input: "",  // Renamed from message to input for generality (text/message)
  results: [],  // Renamed from suggestions to results
  loading: false,
  style: "professional",
  mode: "reply",  // New: 'reply' or 'enhance'
  error: null,

  setInput: (val) => set({ input: val }),
  setStyle: (sty) => set({ style: sty }),
  setMode: (m) => set({ mode: m, results: [], error: null }),  // Clear results on mode change
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
      }

      const res = await fetch(import.meta.env.VITE_API_ENDPOINT + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      set({ results: (state.mode === "reply" ? data?.suggestions : data?.enhancements) || [] });
    } catch (err) {
      set({ error: err.message, results: [] });
    } finally {
      set({ loading: false });
    }
  },
}));