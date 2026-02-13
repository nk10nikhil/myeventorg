"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  Scan,
  LogOut,
  Search,
  RotateCcw,
  Trash2,
  Activity,
} from "lucide-react";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionUser, setActionUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchDashboardData();
      fetchUsers();
    }
  }, [selectedEvent]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.user || data.user.role !== "admin") {
        router.push("/admin");
        return;
      }

      setAdmin(data.user);
      fetchEvents();
    } catch (error) {
      router.push("/admin");
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events?active=true");
      const data = await res.json();
      setEvents(data.events || []);
      if (data.events?.length > 0) {
        setSelectedEvent(data.events[0]._id);
      }
      setLoading(false);
    } catch (error) {
      setToast({ message: "Failed to fetch events", type: "error" });
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`/api/admin/dashboard?eventId=${selectedEvent}`);
      const data = await res.json();
      setStats(data.stats || {});
      setRecentEntries(data.recentEntries || []);
    } catch (error) {
      setToast({ message: "Failed to fetch dashboard data", type: "error" });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?eventId=${selectedEvent}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      setToast({ message: "Failed to fetch users", type: "error" });
    }
  };

  const handleResetQR = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-qr`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to reset QR");
      }

      setToast({ message: "QR status reset successfully", type: "success" });
      fetchDashboardData();
      fetchUsers();
      setShowConfirmModal(false);
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setToast({ message: "User deleted successfully", type: "success" });
      fetchDashboardData();
      fetchUsers();
      setShowConfirmModal(false);
    } catch (error: any) {
      setToast({ message: error.message, type: "error" });
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  );

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage events and entries
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button onClick={() => router.push("/admin/scanner")}>
                <Scan className="w-4 h-4" />
                Scanner
              </Button>
              <Button onClick={handleLogout} variant="secondary">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Event Selector */}
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
          >
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Registered",
              value: stats.totalRegistered || 0,
              icon: <Users className="w-6 h-6" />,
              color: "bg-gray-700",
            },
            {
              label: "Total Tickets",
              value: stats.totalTickets || 0,
              icon: <CheckCircle className="w-6 h-6" />,
              color: "bg-gray-800",
            },
            {
              label: "Checked In",
              value: stats.checkedIn || 0,
              icon: <Activity className="w-6 h-6" />,
              color: "bg-gray-600",
            },
            {
              label: "Remaining",
              value: stats.remaining || 0,
              icon: <Clock className="w-6 h-6" />,
              color: "bg-gray-900",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Entries */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Entries</h2>
          <div className="space-y-3">
            {recentEntries.slice(0, 5).map((entry) => (
              <div
                key={entry._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium">{entry.userId?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.gateName} •{" "}
                    {new Date(entry.entryTime).toLocaleString()}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Registered Users</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.ticket?.scanStatus === "used"
                            ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {user.ticket?.scanStatus || "No Ticket"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {user.ticket && (
                          <button
                            onClick={() => {
                              setActionUser({ ...user, action: "reset" });
                              setShowConfirmModal(true);
                            }}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="Reset QR"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActionUser({ ...user, action: "delete" });
                            setShowConfirmModal(true);
                          }}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={
          actionUser?.action === "reset" ? "Reset QR Status" : "Delete User"
        }
      >
        <p className="mb-6">
          {actionUser?.action === "reset"
            ? `Are you sure you want to reset the QR status for ${actionUser?.name}? This will allow them to enter again.`
            : `Are you sure you want to delete ${actionUser?.name}? This action cannot be undone.`}
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() => setShowConfirmModal(false)}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (actionUser?.action === "reset") {
                handleResetQR(actionUser._id);
              } else {
                handleDeleteUser(actionUser._id);
              }
            }}
            variant="danger"
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
