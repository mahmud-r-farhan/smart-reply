import { motion } from "framer-motion";
import { useState } from "react";
import { useChatStore } from "./store/useChatStore";
import Header from "./components/Header.jsx";
import ModeSelector from "./components/ModeSelector.jsx";  // New import
import StyleSelector from "./components/StyleSelector.jsx";
import InputSection from "./components/InputSection.jsx";
import ResultsSection from "./components/ResultsSection.jsx";  // Renamed import
import EmptyState from "./components/EmptyState.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const { input, results, loading, style, mode, error, setInput, setStyle, setMode, getResults, clear } = useChatStore();
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showStyleInfo, setShowStyleInfo] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    await getResults();
  };

  const handleRegenerate = async () => {
    await getResults();
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 2.5 }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <Header />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          <ModeSelector mode={mode} setMode={setMode} />  {/* New component */}

          <StyleSelector 
            style={style} 
            setStyle={setStyle} 
            showStyleInfo={showStyleInfo} 
            setShowStyleInfo={setShowStyleInfo} 
          />

          <InputSection 
            input={input} 
            setInput={setInput} 
            handleSubmit={handleSubmit} 
            loading={loading} 
            error={error} 
            clear={clear} 
            mode={mode}  // Pass mode
          />

          <ResultsSection 
            results={results} 
            loading={loading} 
            handleRegenerate={handleRegenerate} 
            copiedIndex={copiedIndex} 
            setCopiedIndex={setCopiedIndex} 
            handleCopy={handleCopy} 
            mode={mode}  // Pass mode
          />

          <EmptyState loading={loading} results={results} input={input} />
        </motion.div>

        <Footer />
      </div>
    </div>
  );
};