import { create } from "zustand";

export const useChatStore = create((set) => ({
  message: "",
  suggestion: "",
  loading: false,
  
  setMessage: (msg) => set({ message: msg }),
  clear: () => set({ message: "", suggestion: "" }),

  getSuggestion: async () => {
    set({ loading: true, suggestion: "" });
    try {
      const res = await fetch(import.meta.env.VITE_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: useChatStore.getState().message }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      set({ suggestion: data?.suggestion || "No suggestion received." });
    } catch (err) {
      set({ suggestion: `Error: ${err.message}` });
    } finally {
      set({ loading: false });
    }
  },
}));
