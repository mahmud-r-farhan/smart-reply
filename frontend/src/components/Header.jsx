import { useState } from "react";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";
import { Brain } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <motion.button
            onClick={() => setIsOpen(true)}
            className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/50 cursor-help hover:shadow-indigo-500/70"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.button>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Smart Reply Web
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Generate smart replies, enhancements, or translations for your messages. Also available as a{" "}
          <a
            href="https://github.com/mahmud-r-farhan/smart-reply"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#EA6FD1] decoration-wavy hover:decoration-transparent hover:text-[#EA6FD1]"
          >
            Chrome Extension!
          </a>
        </p>
      </motion.div>

      {/* Side Panel */}
      <SidePanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Header;