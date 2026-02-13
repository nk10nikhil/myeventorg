"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative w-14 h-14 rounded-xl glass-card flex items-center justify-center"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="w-5 h-5 text-primary-500" />
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-14 rounded-xl glass-card flex items-center justify-center group overflow-hidden"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        initial={false}
      />

      {/* Icons with animation */}
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-xl blur-lg bg-gradient-to-br from-primary-400/50 to-secondary-500/50" />
      </div>
    </motion.button>
  );
}
