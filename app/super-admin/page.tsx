"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import { ArrowLeft, Crown } from "lucide-react";

export default function SuperAdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/superadmin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setToast({
        message: "Login successful! Redirecting...",
        type: "success",
      });
      setTimeout(() => {
        router.push("/super-admin/dashboard");
      }, 1500);
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Toast {...toast} onClose={() => setToast(null)} />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </motion.button>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gray-800 dark:bg-gray-200 rounded-xl">
              <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-white dark:text-black" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Super Admin
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Full system access
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                           focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:focus:border-gray-400 outline-none transition-colors text-sm sm:text-base"
                placeholder="superadmin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 
                           focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 dark:focus:border-gray-400 outline-none transition-colors text-sm sm:text-base"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Login
            </Button>
            <Button
              onClick={() => router.push("/admin")}
              variant="secondary"
              className="w-full"
            >
              Admin Login
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <strong>Default Credentials:</strong>
              <br />
              Email: nk10nikhil@gmail.com
              <br />
              Password: nk10nikhil
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
