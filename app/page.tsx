"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Ticket, Users, BarChart3, QrCode, Shield } from "lucide-react";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Loader from "@/components/Loader";

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events?active=true");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">QR Ticketing</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={() => router.push("/login")} variant="secondary">
              Login
            </Button>
            {/* <Button onClick={() => router.push("/admin")}>Admin</Button> */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Event Ticketing Made Simple
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Seamless QR-based registration, ticketing, and entry management
              for your events. Perfect for conferences, concerts, and festivals
              of all sizes.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mt-16"
          >
            {[
              {
                icon: <Ticket className="w-12 h-12 text-primary" />,
                title: "Easy Registration",
                description:
                  "Quick and seamless registration with instant QR code generation",
              },
              {
                icon: <QrCode className="w-12 h-12 text-primary" />,
                title: "QR Scanning",
                description:
                  "Fast entry with native camera scanning and offline support",
              },
              {
                icon: <BarChart3 className="w-12 h-12 text-primary" />,
                title: "Real-time Analytics",
                description:
                  "Track attendance, peak times, and payment stats in real-time",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold mb-8 text-center">
            Upcoming Events
          </h3>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2">{event.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm mb-4">
                      <p>
                        <strong>Venue:</strong> {event.venue}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹{event.ticketPrice}
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        router.push(`/register?eventId=${event._id}`)
                      }
                      className="w-full"
                    >
                      Register Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No upcoming events at the moment
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} QR Ticketing System. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
