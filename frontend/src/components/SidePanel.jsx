import { motion, AnimatePresence } from "framer-motion";
import { X, Linkedin } from "lucide-react";

export default function SidePanel({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-sepia-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-80 bg-transparent backdrop-blur-lg shadow-xl z-50 flex flex-col rounded-l-xl border-l border-gray-200/5"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/10">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Developer Info:
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-6 flex flex-col items-center text-center space-y-4 flex-1">
              {/* Profile */}
              <img
                src="https://avatars.githubusercontent.com/u/114731414?v=4"
                alt="Profile"
                className="w-24 h-24 rounded-full border-2 border-indigo-400 shadow-md"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-200">
                  Mahmud Rahman
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Creative Developer specializing in MERN stack and AI-powered
                  applications. Passionate about building intuitive UIs and
                  optimizing career tools.
                </p>
              </div>

              {/* LinkedIn Button */}
              <button
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/mahmud-r-farhan/",
                    "_blank"
                  )
                }
                className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition-all duration-200 cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
                <span>View LinkedIn</span>
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200/10 p-4 text-center flex  justify-center gap-2 hover:gap-4 transition-all duration-200">
              <button
                onClick={() =>
                  window.open("https://gravatar.com/floawd", "_blank")
                }
                className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200 cursor-pointer"
              >
                <img src="https://docs.gravatar.com/wp-content/uploads/2025/02/avatar-default-20250210-256.png" alt="Gravatar" className="w-6 h-6"/>
              </button>
               <button
                onClick={() =>
                  window.open("https://github.com/mahmud-r-farhan", "_blank")
                }
                className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200 cursor-pointer"
              >
                <img src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png" alt="Gravatar" className="w-6 h-6"/>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
