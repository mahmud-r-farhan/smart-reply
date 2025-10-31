import { create } from "zustand";

export const useChatStore = create((set) => ({
  message: "",
  suggestions: [],
  loading: false,
  style: "professional",
  error: null,

  setMessage: (msg) => set({ message: msg }),
  setStyle: (sty) => set({ style: sty }),
  clear: () => set({ message: "", suggestions: [], error: null }),

  getSuggestions: async () => {
    set({ loading: true, suggestions: [], error: null });
    try {
      const state = useChatStore.getState();
      const res = await fetch(import.meta.env.VITE_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: state.message, style: state.style }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      set({ suggestions: data?.suggestions || [] });
    } catch (err) {
      set({ error: err.message, suggestions: [] });
    } finally {
      set({ loading: false });
    }
  },
}));