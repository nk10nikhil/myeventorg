"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  LogOut,
  QrCode as QrCodeIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.user || data.user.role !== "user") {
        router.push("/login");
        return;
      }

      setUser(data.user);
      fetchTickets();
    } catch (error) {
      router.push("/login");
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      setToast({ message: "Failed to fetch tickets", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const downloadTicket = (ticket: any) => {
    const link = document.createElement("a");
    link.href = ticket.qrCode;
    link.download = `ticket-${ticket._id}.png`;
    link.click();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      {/* Subtle background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-gray-100/20 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Toast {...toast} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px] sm:max-w-none">
                {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            My Tickets
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage and view your event tickets
          </p>
        </motion.div>

        {tickets.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 h-full border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-lg transition-all">
                  {/* Status badge */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                      {ticket.eventId?.name || "Event"}
                    </h3>
                    {ticket.scanStatus === "used" ? (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      #{ticket._id.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm mb-5 sm:mb-6 p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status:
                      </span>
                      <span
                        className={`font-semibold ${
                          ticket.scanStatus === "used"
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {ticket.scanStatus === "used" ? "✓ Used" : "○ Unused"}
                      </span>
                    </div>
                    {ticket.scannedAt && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Entry:
                          </span>
                          <span className="font-medium">
                            {new Date(ticket.scannedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Gate:
                          </span>
                          <span className="font-medium">
                            {ticket.scannedAtGate}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowQRModal(true);
                      }}
                      className="flex-1"
                      variant="ghost"
                      size="sm"
                    >
                      <QrCodeIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <Button
                      onClick={() => downloadTicket(ticket)}
                      className="flex-1"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 px-4"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <QrCodeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                No Tickets Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                Register for an event to get your first ticket
              </p>
              <Button onClick={() => router.push("/")}>Browse Events</Button>
            </div>
          </motion.div>
        )}
      </main>

      {/* QR Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Ticket QR Code"
      >
        {selectedTicket && (
          <div className="text-center">
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-950 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 inline-block">
              <img
                src={selectedTicket.qrCode}
                alt="QR Code"
                className="w-48 h-48 sm:w-64 sm:h-64 mx-auto"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              Present this QR code at the venue for entry
            </p>
            <Button
              onClick={() => downloadTicket(selectedTicket)}
              className="w-full"
            >
              <Download className="w-4 h-4" />
              Download Ticket
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
