import { motion } from "framer-motion";
import { useChatStore } from "./store/useChatStore";

export default function App() {
  const { message, suggestion, loading, setMessage, getSuggestion, clear } = useChatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await getSuggestion();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6"
      >
        <h1 className="text-2xl font-semibold text-center mb-4">🤖 Smart Reply</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="w-full p-3 border rounded-xl resize-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          <div className="flex gap-2 justify-between">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
            >
              {loading ? "Analyzing..." : "Get Smart Reply"}
            </button>
            <button
              type="button"
              onClick={clear}
              className="py-2 px-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </form>

        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl"
          >
            <p className="font-semibold text-indigo-700 mb-1">Suggested Reply:</p>
            <p className="text-gray-800">{suggestion}</p>
          </motion.div>
        )}
      </motion.div>

      <p className="mt-4 text-sm text-gray-500">Powered by Smart Reply API</p>
    </div>
  );
}
