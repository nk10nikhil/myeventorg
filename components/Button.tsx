"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

type ButtonProps = {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "outline"
    | "ghost";
  loading?: boolean;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
} & Omit<HTMLMotionProps<"button">, "children">;

export default function Button({
  variant = "primary",
  loading = false,
  children,
  disabled,
  className = "",
  size = "md",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white text-white dark:text-black shadow-sm hover:shadow-md",
    secondary:
      "bg-gray-700 hover:bg-gray-800 dark:bg-gray-300 dark:hover:bg-gray-200 text-white dark:text-black shadow-sm hover:shadow-md",
    danger:
      "bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-100 text-white dark:text-black shadow-sm hover:shadow-md",
    success:
      "bg-gray-700 hover:bg-gray-800 dark:bg-gray-300 dark:hover:bg-gray-200 text-white dark:text-black shadow-sm hover:shadow-md",
    outline:
      "border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    ghost:
      "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.99 }}
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
