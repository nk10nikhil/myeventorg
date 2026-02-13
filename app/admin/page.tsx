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
    <div className="min-h-screen flex items-center justify-center p-4">
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
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Login</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign in to access your dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Login
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
