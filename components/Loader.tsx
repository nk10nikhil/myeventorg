"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1/3 bg-gray-400/10 dark:bg-gray-600/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1/3 bg-gray-500/10 dark:bg-gray-700/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-20 h-20 border-4 border-gray-700 dark:border-gray-300 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-2 w-16 h-16 border-4 border-gray-600 dark:border-gray-400 border-l-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-4 w-12 h-12 border-4 border-gray-800 dark:border-gray-200 border-r-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* Center pulse dot */}
        <motion.div
          className="absolute inset-0 m-auto w-4 h-4 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 dark:from-gray-300 dark:via-gray-200 dark:to-gray-100 rounded-full"
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
