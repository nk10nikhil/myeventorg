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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Toast {...toast} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={handleLogout} variant="secondary">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
        </div>

        {tickets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      {ticket.eventId?.name || "Event"}
                    </h3>
                    {ticket.scanStatus === "used" ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <p>
                      <strong>Ticket ID:</strong> {ticket._id.slice(-8)}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          ticket.scanStatus === "used"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                      >
                        {ticket.scanStatus === "used" ? "Used" : "Unused"}
                      </span>
                    </p>
                    {ticket.scannedAt && (
                      <>
                        <p>
                          <strong>Entry Time:</strong>{" "}
                          {new Date(ticket.scannedAt).toLocaleString()}
                        </p>
                        <p>
                          <strong>Gate:</strong> {ticket.scannedAtGate}
                        </p>
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
                      variant="secondary"
                    >
                      <QrCodeIcon className="w-4 h-4" />
                      View QR
                    </Button>
                    <Button
                      onClick={() => downloadTicket(ticket)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400">
              No tickets found. Register for an event to get started.
            </p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Browse Events
            </Button>
          </div>
        )}
      </main>

      {/* QR Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Your Ticket QR Code"
      >
        {selectedTicket && (
          <div className="text-center">
            <img
              src={selectedTicket.qrCode}
              alt="QR Code"
              className="w-full max-w-sm mx-auto mb-4"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
