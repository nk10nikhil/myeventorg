"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import { ArrowLeft, Shield } from "lucide-react";

export default function AdminLogin() {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
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
        router.push("/admin/dashboard");
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
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </motion.button>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm">
          <div>
            <div className="flex items-center gap-3 sm:gap-4 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl"
              >
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700 dark:text-gray-300" />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Admin Portal
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  Secure access for administrators
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                           focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 
                           outline-none transition-colors text-sm sm:text-base"
                  placeholder="admin@example.com"
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
                           focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 
                           outline-none transition-colors text-sm sm:text-base"
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                loading={loading}
                size="lg"
                variant="secondary"
              >
                Login to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/super-admin")}
                className="w-full"
              >
                Super Admin Login
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
