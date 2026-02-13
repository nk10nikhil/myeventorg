"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import { ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    eventId: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events?active=true");
      const data = await res.json();
      setEvents(data.events || []);
      if (data.events?.length > 0) {
        setFormData((prev) => ({ ...prev, eventId: data.events[0]._id }));
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
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
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-gray-100/30 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Toast {...toast} onClose={() => setToast(null)} />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </motion.button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
              Login to access your tickets
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                  Select Event
                </label>
                <select
                  required
                  value={formData.eventId}
                  onChange={(e) =>
                    setFormData({ ...formData, eventId: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
                           focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 
                           outline-none transition-all text-sm sm:text-base"
                  aria-label="Select event"
                >
                  <option value="">Choose an event</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
                           focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 
                           outline-none transition-all text-sm sm:text-base"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 sm:mb-2 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
                           focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 
                           outline-none transition-all text-sm sm:text-base"
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full mt-2" loading={loading}>
                Login to Dashboard
              </Button>
            </form>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/register")}
                  className="font-medium text-gray-700 dark:text-gray-300 hover:underline"
                >
                  Register now
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
