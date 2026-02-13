"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/3 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1/3 bg-secondary-500/20 dark:bg-secondary-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full shadow-glow"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-2 w-16 h-16 border-4 border-secondary-500 border-l-transparent rounded-full shadow-glow-purple"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-4 w-12 h-12 border-4 border-accent-500 border-r-transparent rounded-full shadow-glow-pink"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* Center pulse dot */}
        <motion.div
          className="absolute inset-0 m-auto w-4 h-4 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute mt-32 text-sm font-semibold gradient-text"
      >
        Loading...
      </motion.p>
    </div>
  );
}
