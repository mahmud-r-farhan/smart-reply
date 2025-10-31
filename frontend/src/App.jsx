import { useState } from "react";
import { motion } from "framer-motion";
import { useChatStore } from "./store/useChatStore";

export default function App() {
  const { message, suggestions, loading, style, setMessage, setStyle, getSuggestions, clear } = useChatStore();

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await getSuggestions();
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const styles = ["professional", "friendly", "humorous", "concise"];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-6 md:p-8"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">🤖 Smart Reply Web</h1>
        <p className="text-center text-gray-600 mb-8">Generate smart replies for your messages. Choose a style and get suggestions instantly. Also available as a Chrome Extension!</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4">
            <textarea
              className="flex-1 p-4 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm"
              rows={5}
              placeholder="Type or paste the message you received..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex flex-col gap-2 md:w-48">
              <label className="text-sm font-medium text-gray-700">Reply Style:</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="p-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm"
              >
                {styles.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Generating..." : "Get Smart Replies"}
            </button>
            <button
              type="button"
              onClick={clear}
              className="py-3 px-6 bg-gray-200 text-gray-800 font-medium rounded-2xl hover:bg-gray-300 transition shadow-md"
            >
              Clear
            </button>
          </div>
        </form>

        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">Suggested Replies ({style.charAt(0).toUpperCase() + style.slice(1)}):</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((sug, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl shadow-sm relative"
                >
                  <p className="text-gray-800 mb-3">{sug}</p>
                  <button
                    onClick={() => handleCopy(sug, index)}
                    className="absolute bottom-3 right-3 py-1 px-3 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full hover:bg-indigo-200 transition"
                  >
                    {copiedIndex === index ? "Copied!" : "Copy"}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      <p className="mt-6 text-sm text-gray-500">Powered by Smart Reply API</p>
    </div>
  );
}