import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";

const StyleSelector = ({ style, setStyle, showStyleInfo, setShowStyleInfo }) => {
  const styles = [
    { value: "professional", label: "Professional", icon: "💼", description: "Formal and business-like tone" },
    { value: "friendly", label: "Friendly", icon: "😊", description: "Warm and approachable style" },
    { value: "humorous", label: "Humorous", icon: "😄", description: "Light-hearted with witty elements" },
    { value: "concise", label: "Concise", icon: "⚡", description: "Short and to-the-point responses" }
  ];

  return (
    <div className="p-6 border-b border-slate-800 bg-slate-900/30 relative">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <span className="text-sm font-semibold text-slate-300">Response Style</span>
        <button
          onClick={() => setShowStyleInfo(!showStyleInfo)}
          className="ml-2 p-1 text-slate-500 hover:text-slate-300 transition"
          title="Style information"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {styles.map((s) => (
          <motion.button
            key={s.value}
            onClick={() => setStyle(s.value)}
            className={`p-3 rounded-xl font-medium transition-all relative ${
              style === s.value
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl mb-1 block">{s.icon}</span>
            <span className="text-sm">{s.label}</span>
            {showStyleInfo && (
              <div className="absolute top-full left-0 mt-2 p-2 bg-slate-800 text-slate-400 text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                {s.description}
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;