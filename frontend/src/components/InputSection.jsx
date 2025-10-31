import React from "react";
import { motion } from "framer-motion";
import { Zap, Trash2 } from "lucide-react";
import TextareaAutoResize from "./TextareaAutoResize";

const InputSection = ({ message, setMessage, handleSubmit, loading, error, clear }) => {
  return (
    <div className="p-6">
      <div className="relative">
        <TextareaAutoResize
          className="w-full min-h-[120px] max-h-[300px] p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent overflow-hidden transition-all"
          placeholder="Paste the message you received here... (Ctrl/Cmd + Enter to generate)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }}
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-500">
          {message.length} / 2000
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-red-400 text-sm"
        >
          {error}
        </motion.p>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !message.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
        >
          {loading ? (
            <>
              <motion.div 
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Generate Replies</span>
            </>
          )}
        </button>
        <button
          onClick={clear}
          className="p-3.5 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-slate-300 transition-all"
          title="Clear input"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InputSection;