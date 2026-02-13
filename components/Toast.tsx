"use client";

import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const colors = {
    success:
      "bg-green-50/90 dark:bg-green-900/30 border-green-300 dark:border-green-700/50 shadow-green-500/20",
    error:
      "bg-red-50/90 dark:bg-red-900/30 border-red-300 dark:border-red-700/50 shadow-red-500/20",
    info: "bg-blue-50/90 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700/50 shadow-blue-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl ${colors[type]} shadow-lg min-w-[320px]`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="p-1.5 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
