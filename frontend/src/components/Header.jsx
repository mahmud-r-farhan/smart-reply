import { useState, memo } from "react";
import { motion } from "framer-motion";
import SidePanel from "./SidePanel";

const Header = memo(() => {
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
            whileHover={{ rotate: 360, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="
              p-2 rounded-2xl cursor-help
              bg-white/10
              backdrop-blur-xl
              border border-white/20
              shadow-lg shadow-indigo-500/20
              hover:shadow-indigo-500/40
              relative overflow-hidden
            "
          >
            {/* Glass shine */}
            <span className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-50 pointer-events-none" />

            <img
              src="https://i.postimg.cc/HkhmHFxy/icons8-chatbot-48.png"
              alt="Logo"
              title="Developer?"
              className="relative z-10"
            />
          </motion.button>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Smart Reply Web
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Generate smart replies, enhancements, or translations for your messages. 
          <span className="hidden md:inline">
                Also available as a{" "}
                <a
                  href="https://github.com/mahmud-r-farhan/smart-reply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[#EA6FD1] decoration-wavy hover:decoration-transparent hover:text-[#EA6FD1]"
                >
                  Chrome Extension!
                </a>
              </span>
        </p>
      </motion.div>

      {/* Side Panel */}
      <SidePanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
});

Header.displayName = 'Header';
export default Header;