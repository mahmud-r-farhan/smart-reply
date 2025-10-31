import React from "react";
import { motion } from "framer-motion";
import { RotateCcw, Copy, Check } from "lucide-react";

const SuggestionsSection = ({ suggestions, loading, handleRegenerate, copiedIndex, setCopiedIndex, handleCopy }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="p-6 pt-0">
      <div className="flex items-center gap-2 mb-4">
        <motion.div 
          className="w-2 h-2 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <h2 className="text-lg font-semibold text-slate-200">
          AI-Generated Responses
        </h2>
        <span className="text-sm text-slate-500 ml-auto">
          {suggestions.length} suggestions
        </span>
        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="ml-4 flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition"
          title="Regenerate with same settings"
        >
          <RotateCcw className="w-4 h-4" />
          Regenerate
        </button>
      </div>
      
      <motion.div 
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {suggestions.map((sug, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="group relative p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-indigo-500/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold mt-1">
                {index + 1}
              </div>
              <p className="flex-1 text-slate-300 leading-relaxed pr-12">
                {sug}
              </p>
              <button
                onClick={() => handleCopy(sug, index)}
                className="absolute top-4 right-4 p-2 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Copy to clipboard"
                aria-label="Copy suggestion"
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};


export default SuggestionsSection;