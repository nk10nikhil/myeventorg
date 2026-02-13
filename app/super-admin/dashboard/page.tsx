"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Shield,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/Toast";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [superAdmin, setSuperAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: "",
    description: "",
    venue: "",
    startDate: "",
    endDate: "",
    ticketPrice: "",
    maxCapacity: "",
  });
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    eventIds: [] as string[],
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.user || data.user.role !== "superadmin") {
        router.push("/super-admin");
        return;
      }

      setSuperAdmin(data.user);
      fetchData();
    } catch (error) {
      router.push("/super-admin");
    }
  };

  const fetchData = async () => {
    try {
      const [eventsRes, adminsRes, analyticsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/superadmin/admins"),
        fetch("/api/superadmin/analytics"),
      ]);

      const eventsData = await eventsRes.json();
      const adminsData = await adminsRes.json();
      const analyticsData = await analyticsRes.json();

      setEvents(eventsData.events || []);
      setAdmins(adminsData.admins || []);
      setAnalytics(analyticsData.analytics || []);
    } catch (error) {
      setToast({ message: "Failed to fetch data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });

      if (!res.ok) {
        throw new Error("Failed to create event");
      }

      setToast({ message: "Event created successfully", type: "success" });
      setShowEventModal(false);
      fetchData();
      setEventForm({
        name: "",
        description: "",
        venue: "",
        startDate: "",
        endDate: "",
        ticketPrice: "",
        maxCapacity: "",
      });
    } catch (error) {
      setToast({ message: "Failed to create event", type: "error" });
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/superadmin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm),
      });

      if (!res.ok) {
        throw new Error("Failed to create admin");
      }

      setToast({ message: "Admin created successfully", type: "success" });
      setShowAdminModal(false);
      fetchData();
      setAdminForm({
        name: "",
        email: "",
        password: "",
        eventIds: [],
      });
    } catch (error) {
      setToast({ message: "Failed to create admin", type: "error" });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete event");
      }

      setToast({ message: "Event deleted successfully", type: "success" });
      fetchData();
    } catch (error) {
      setToast({ message: "Failed to delete event", type: "error" });
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const res = await fetch(`/api/superadmin/admins/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete admin");
      }

      setToast({ message: "Admin deleted successfully", type: "success" });
      fetchData();
    } catch (error) {
      setToast({ message: "Failed to delete admin", type: "error" });
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/super-admin");
  };

  if (loading) {
    return <Loader />;
  }

  // Chart data
  const chartData = {
    labels: events.map((e) => e.name),
    datasets: [
      {
        label: "Check-in Rate (%)",
        data: analytics.map((a) => a.checkInRate.toFixed(1)),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Event Check-in Rates",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Toast {...toast} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
                <p className="text-sm opacity-90">Full System Control</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button onClick={handleLogout} variant="secondary">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Events",
              value: events.length,
              icon: <Calendar className="w-6 h-6" />,
              color: "bg-blue-500",
            },
            {
              label: "Total Admins",
              value: admins.length,
              icon: <Shield className="w-6 h-6" />,
              color: "bg-green-500",
            },
            {
              label: "Total Users",
              value: analytics.reduce((sum, a) => sum + a.totalUsers, 0),
              icon: <Users className="w-6 h-6" />,
              color: "bg-purple-500",
            },
            {
              label: "Total Revenue",
              value: `₹${analytics.reduce((sum, a) => sum + a.revenue, 0)}`,
              icon: <BarChart3 className="w-6 h-6" />,
              color: "bg-orange-500",
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

        {/* Analytics Chart */}
        {analytics.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {/* Events Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Events</h2>
            <Button onClick={() => setShowEventModal(true)}>
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{event.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.venue}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Price:</strong> ₹{event.ticketPrice}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {event.maxCapacity}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admins Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Admins</h2>
            <Button onClick={() => setShowAdminModal(true)}>
              <Plus className="w-4 h-4" />
              Create Admin
            </Button>
          </div>

          <div className="space-y-3">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {admin.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Manages {admin.eventIds?.length || 0} event(s)
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAdmin(admin._id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title="Create New Event"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Name</label>
            <input
              type="text"
              required
              value={eventForm.name}
              onChange={(e) =>
                setEventForm({ ...eventForm, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              required
              value={eventForm.description}
              onChange={(e) =>
                setEventForm({ ...eventForm, description: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Venue</label>
            <input
              type="text"
              required
              value={eventForm.venue}
              onChange={(e) =>
                setEventForm({ ...eventForm, venue: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="datetime-local"
                required
                value={eventForm.startDate}
                onChange={(e) =>
                  setEventForm({ ...eventForm, startDate: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="datetime-local"
                required
                value={eventForm.endDate}
                onChange={(e) =>
                  setEventForm({ ...eventForm, endDate: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Ticket Price
              </label>
              <input
                type="number"
                required
                value={eventForm.ticketPrice}
                onChange={(e) =>
                  setEventForm({ ...eventForm, ticketPrice: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Capacity
              </label>
              <input
                type="number"
                required
                value={eventForm.maxCapacity}
                onChange={(e) =>
                  setEventForm({ ...eventForm, maxCapacity: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </Modal>

      {/* Create Admin Modal */}
      <Modal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        title="Create New Admin"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={adminForm.name}
              onChange={(e) =>
                setAdminForm({ ...adminForm, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={adminForm.email}
              onChange={(e) =>
                setAdminForm({ ...adminForm, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={adminForm.password}
              onChange={(e) =>
                setAdminForm({ ...adminForm, password: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Assign Events
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
              {events.map((event) => (
                <label
                  key={event._id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={adminForm.eventIds.includes(event._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAdminForm({
                          ...adminForm,
                          eventIds: [...adminForm.eventIds, event._id],
                        });
                      } else {
                        setAdminForm({
                          ...adminForm,
                          eventIds: adminForm.eventIds.filter(
                            (id) => id !== event._id,
                          ),
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{event.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Admin
          </Button>
        </form>
      </Modal>
    </div>
  );
}
