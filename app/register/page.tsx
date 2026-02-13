"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import { ArrowLeft } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      const data = await res.json();
      setEvent(data.event);
    } catch (error) {
      setToast({ message: "Failed to fetch event details", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId) {
      setToast({ message: "Please select an event", type: "error" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }

    setLoading(true);

    try {
      console.log("[Register] Starting registration for:", formData.email);

      // Register user
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          eventId,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(registerData.error || "Registration failed");
      }

      console.log("[Register] User registered:", registerData.user.id);

      // Proceed to payment
      await initiatePayment(registerData.user.id);
    } catch (error: any) {
      console.error("[Register] Registration error:", error);
      setToast({ message: error.message, type: "error" });
      setLoading(false);
    }
  };

  const initiatePayment = async (userId: string) => {
    try {
      console.log("[Payment] Initiating payment for user:", userId);

      if (!event) {
        throw new Error("Event details not loaded");
      }

      console.log(
        "[Payment] Event loaded:",
        event.name,
        "Price:",
        event.ticketPrice,
      );

      // Create Razorpay order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Check if Razorpay script is already loaded
      const loadRazorpay = () => {
        return new Promise((resolve, reject) => {
          // Check if already loaded
          if ((window as any).Razorpay) {
            resolve(true);
            return;
          }

          // Check if script already exists
          const existingScript = document.querySelector(
            'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
          );

          if (existingScript) {
            existingScript.addEventListener("load", () => resolve(true));
            existingScript.addEventListener("error", () =>
              reject(new Error("Failed to load Razorpay")),
            );
            return;
          }

          // Load new script
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.body.appendChild(script);
        });
      };

      await loadRazorpay();

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: event.name,
        description: "Event Registration",
        image: "/logo.png", // Optional: add your logo
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async (response: any) => {
          try {
            await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              userId,
            );
          } catch (err: any) {
            setToast({ message: err.message, type: "error" });
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setToast({ message: "Payment cancelled", type: "info" });
          },
        },
        theme: {
          color: "#374151",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      setToast({
        message: error.message || "Failed to initiate payment",
        type: "error",
      });
      setLoading(false);
    }
  };

  const verifyPayment = async (
    orderId: string,
    paymentId: string,
    signature: string,
    userId: string,
  ) => {
    try {
      if (!event) {
        throw new Error("Event details not found");
      }

      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
          userId,
          eventId,
          amount: event.ticketPrice * 100,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment verification failed");
      }

      setToast({
        message: "Payment successful! Ticket generated. Redirecting...",
        type: "success",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setToast({
        message: error.message || "Payment verification failed",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
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
          className="flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </motion.button>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              Register
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
              {event ? `for ${event.name}` : "Create your account"}
            </p>

            {event && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0">
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {event.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{event.ticketPrice}
                    </div>
                    <p className="text-xs text-gray-500">per ticket</p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                             focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 
                             outline-none transition-colors text-sm sm:text-base"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
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
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                             focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 
                             outline-none transition-colors text-sm sm:text-base"
                    placeholder="+91 1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                             focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 
                             outline-none transition-colors text-sm sm:text-base"
                    aria-label="Date of birth"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Create Password
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

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                             focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 
                             outline-none transition-colors text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-2"
                loading={loading}
                size="lg"
              >
                {event ? `Register & Pay ₹${event.ticketPrice}` : "Register"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-gray-700 dark:text-gray-300 hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
