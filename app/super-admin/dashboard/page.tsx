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
  const [users, setUsers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [showActivityLogsModal, setShowActivityLogsModal] = useState(false);
  const [showAllUsersModal, setShowAllUsersModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedEventForUsers, setSelectedEventForUsers] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [ticketSearchTerm, setTicketSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [logSearchTerm, setLogSearchTerm] = useState("");
  const [ticketFilter, setTicketFilter] = useState("all"); // all, completed, pending, scanned, not-scanned
  const [userFilter, setUserFilter] = useState("all"); // all, with-ticket, without-ticket
  const [activeTab, setActiveTab] = useState<"overview" | "tickets" | "logs">(
    "overview",
  );
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
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
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    eventId: "",
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

  const fetchUsersForEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/admin/users?eventId=${eventId}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      setToast({ message: "Failed to fetch users", type: "error" });
    }
  };

  const handleViewUsers = (eventId: string) => {
    setSelectedEventForUsers(eventId);
    fetchUsersForEvent(eventId);
    setShowUsersModal(true);
  };

  const fetchAllTickets = async () => {
    try {
      const res = await fetch("/api/superadmin/tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
      setShowTicketsModal(true);
    } catch (error) {
      setToast({ message: "Failed to fetch tickets", type: "error" });
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch("/api/superadmin/users");
      const data = await res.json();
      setAllUsers(data.users || []);
      setShowAllUsersModal(true);
    } catch (error) {
      setToast({ message: "Failed to fetch users", type: "error" });
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "",
      eventId: user.eventId || "",
    });
    setShowAllUsersModal(false);
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: any = {
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        eventId: userForm.eventId,
      };

      if (userForm.password) {
        payload.password = userForm.password;
      }

      const res = await fetch(`/api/superadmin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      setToast({ message: "User updated successfully", type: "success" });
      setShowEditUserModal(false);
      setEditingUser(null);
      fetchAllUsers();
      setUserForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        eventId: "",
      });
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to update user",
        type: "error",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This will also delete their tickets and entries.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/superadmin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      setToast({ message: "User deleted successfully", type: "success" });
      fetchAllUsers();
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to delete user",
        type: "error",
      });
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const res = await fetch("/api/admin/activity-logs?limit=100");
      const data = await res.json();
      setActivityLogs(data.logs || []);
      setShowActivityLogsModal(true);
    } catch (error) {
      setToast({ message: "Failed to fetch activity logs", type: "error" });
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingEvent
        ? `/api/events/${editingEvent._id}`
        : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventForm,
          ticketPrice: parseFloat(eventForm.ticketPrice),
          maxCapacity: parseInt(eventForm.maxCapacity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save event");
      }

      setToast({
        message: editingEvent
          ? "Event updated successfully"
          : "Event created successfully",
        type: "success",
      });
      setShowEventModal(false);
      setEditingEvent(null);
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
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to save event",
        type: "error",
      });
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingAdmin
        ? `/api/superadmin/admins/${editingAdmin._id}`
        : "/api/superadmin/admins";
      const method = editingAdmin ? "PUT" : "POST";

      // Only include password if it's not empty
      const payload: any = {
        name: adminForm.name,
        email: adminForm.email,
        eventIds: adminForm.eventIds,
      };

      // Include password only if provided (for create or if admin wants to change it)
      if (adminForm.password) {
        payload.password = adminForm.password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || `Failed to ${editingAdmin ? "update" : "create"} admin`,
        );
      }

      setToast({
        message: editingAdmin
          ? "Admin updated successfully"
          : "Admin created successfully",
        type: "success",
      });
      setShowAdminModal(false);
      setEditingAdmin(null);
      fetchData();
      setAdminForm({
        name: "",
        email: "",
        password: "",
        eventIds: [],
      });
    } catch (error: any) {
      setToast({
        message:
          error.message ||
          `Failed to ${editingAdmin ? "update" : "create"} admin`,
        type: "error",
      });
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

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setEventForm({
      name: event.name,
      description: event.description,
      venue: event.venue,
      startDate: event.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : "",
      endDate: event.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : "",
      ticketPrice: event.ticketPrice.toString(),
      maxCapacity: event.maxCapacity.toString(),
    });
    setShowEventModal(true);
  };

  const handleEditAdmin = (admin: any) => {
    setEditingAdmin(admin);
    setAdminForm({
      name: admin.name,
      email: admin.email,
      password: "", // Don't populate password for security
      eventIds: admin.eventIds?.map((e: any) => e._id || e) || [],
    });
    setShowAdminModal(true);
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

        {/* Quick Access Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={fetchAllTickets} variant="secondary">
            <Users className="w-4 h-4" />
            View All Tickets
          </Button>
          <Button onClick={fetchAllUsers} variant="secondary">
            <Users className="w-4 h-4" />
            Manage All Users
          </Button>
          <Button onClick={fetchActivityLogs} variant="secondary">
            <BarChart3 className="w-4 h-4" />
            Activity Logs
          </Button>
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
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-colors"
                      aria-label="Edit event"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                      aria-label="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm space-y-1 mb-3">
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
                <Button
                  onClick={() => handleViewUsers(event._id)}
                  variant="secondary"
                  className="w-full text-sm py-2"
                >
                  <Users className="w-4 h-4" />
                  View Users
                </Button>
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
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditAdmin(admin)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 rounded-lg transition-colors"
                    aria-label="Edit admin"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(admin._id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                    aria-label="Delete admin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Overall Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Overall Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Total Tickets Sold</span>
                <span className="text-lg font-bold text-primary">
                  {analytics.reduce((sum, a) => sum + a.totalTickets, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Users Checked In</span>
                <span className="text-lg font-bold text-green-600">
                  {analytics.reduce((sum, a) => sum + a.checkedIn, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Pending Check-ins</span>
                <span className="text-lg font-bold text-orange-600">
                  {analytics.reduce((sum, a) => sum + a.remaining, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Avg Check-in Rate</span>
                <span className="text-lg font-bold text-blue-600">
                  {analytics.length > 0
                    ? (
                        analytics.reduce((sum, a) => sum + a.checkInRate, 0) /
                        analytics.length
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Event Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Event Performance</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analytics.map((event: any) => (
                <div
                  key={event.eventId}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">
                      {event.eventName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.checkInRate.toFixed(1)}% checked in
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>👥 {event.totalUsers} users</span>
                    <span>🎫 {event.totalTickets} tickets</span>
                    <span>💰 ₹{event.revenue}</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${event.checkInRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Create/Edit Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
          setEventForm({
            name: "",
            description: "",
            venue: "",
            startDate: "",
            endDate: "",
            ticketPrice: "",
            maxCapacity: "",
          });
        }}
        title={editingEvent ? "Edit Event" : "Create New Event"}
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
            {editingEvent ? "Update Event" : "Create Event"}
          </Button>
        </form>
      </Modal>

      {/* Create/Edit Admin Modal */}
      <Modal
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false);
          setEditingAdmin(null);
          setAdminForm({
            name: "",
            email: "",
            password: "",
            eventIds: [],
          });
        }}
        title={editingAdmin ? "Edit Admin" : "Create New Admin"}
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
            <label className="block text-sm font-medium mb-2">
              Password{" "}
              {editingAdmin && (
                <span className="text-xs text-gray-500">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              type="password"
              required={!editingAdmin}
              value={adminForm.password}
              onChange={(e) =>
                setAdminForm({ ...adminForm, password: e.target.value })
              }
              placeholder={
                editingAdmin ? "Leave blank to keep current password" : ""
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
            {editingAdmin ? "Update Admin" : "Create Admin"}
          </Button>
        </form>
      </Modal>

      {/* View Users Modal */}
      <Modal
        isOpen={showUsersModal}
        onClose={() => {
          setShowUsersModal(false);
          setUsers([]);
          setSelectedEventForUsers("");
        }}
        title={`Users - ${events.find((e) => e._id === selectedEventForUsers)?.name || "Event"}`}
        size="xl"
      >
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No users registered for this event yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map((user: any) => (
                <div
                  key={user._id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.phone}
                      </p>
                      {user.ticket && (
                        <div className="mt-2 text-xs space-y-1">
                          <p>
                            <span className="font-medium">Payment:</span>{" "}
                            <span
                              className={
                                user.ticket.paymentStatus === "completed"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }
                            >
                              {user.ticket.paymentStatus}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">Scan Status:</span>{" "}
                            <span
                              className={
                                user.ticket.scanStatus === "used"
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }
                            >
                              {user.ticket.scanStatus}
                            </span>
                          </p>
                          {user.ticket.scannedAt && (
                            <p>
                              <span className="font-medium">Scanned:</span>{" "}
                              {new Date(user.ticket.scannedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* All Tickets Modal */}
      <Modal
        isOpen={showTicketsModal}
        onClose={() => {
          setShowTicketsModal(false);
          setTickets([]);
          setTicketSearchTerm("");
          setTicketFilter("all");
        }}
        title="All Tickets"
        size="xl"
      >
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or event..."
                value={ticketSearchTerm}
                onChange={(e) => setTicketSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
            <select
              value={ticketFilter}
              onChange={(e) => setTicketFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none text-sm"
            >
              <option value="all">All Tickets</option>
              <option value="completed">Payment Completed</option>
              <option value="pending">Payment Pending</option>
              <option value="scanned">Scanned</option>
              <option value="not-scanned">Not Scanned</option>
            </select>
          </div>

          {(() => {
            // Filter and search logic
            let filteredTickets = tickets.filter((ticket: any) => {
              const matchesSearch =
                ticket.userName
                  ?.toLowerCase()
                  .includes(ticketSearchTerm.toLowerCase()) ||
                ticket.userEmail
                  ?.toLowerCase()
                  .includes(ticketSearchTerm.toLowerCase()) ||
                ticket.eventName
                  ?.toLowerCase()
                  .includes(ticketSearchTerm.toLowerCase());

              const matchesFilter =
                ticketFilter === "all" ||
                (ticketFilter === "completed" &&
                  ticket.paymentStatus === "completed") ||
                (ticketFilter === "pending" &&
                  ticket.paymentStatus !== "completed") ||
                (ticketFilter === "scanned" && ticket.scanStatus === "used") ||
                (ticketFilter === "not-scanned" &&
                  ticket.scanStatus !== "used");

              return matchesSearch && matchesFilter;
            });

            return filteredTickets.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {tickets.length === 0
                  ? "No tickets found."
                  : "No tickets match your search criteria."}
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Showing {filteredTickets.length} of {tickets.length} tickets
                </div>
                {filteredTickets.map((ticket: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <p className="font-medium">{ticket.userName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {ticket.userEmail}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Event: {ticket.eventName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            ticket.paymentStatus === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {ticket.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className={
                          ticket.scanStatus === "used"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {ticket.scanStatus === "used"
                          ? "✓ Scanned"
                          : "⏳ Not Scanned"}
                      </span>
                      {ticket.scannedAt && (
                        <span className="text-gray-500">
                          {new Date(ticket.scannedAt).toLocaleDateString()} at{" "}
                          {new Date(ticket.scannedAt).toLocaleTimeString()}
                        </span>
                      )}
                      {ticket.scannedAtGate && (
                        <span className="text-gray-500">
                          Gate: {ticket.scannedAtGate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </Modal>

      {/* Activity Logs Modal */}
      <Modal
        isOpen={showActivityLogsModal}
        onClose={() => {
          setShowActivityLogsModal(false);
          setActivityLogs([]);
          setLogSearchTerm("");
        }}
        title="Activity Logs"
        size="xl"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by action, details, or admin name..."
                value={logSearchTerm}
                onChange={(e) => setLogSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>

          {(() => {
            // Filter logs by search term
            let filteredLogs = activityLogs.filter((log: any) => {
              const matchesSearch =
                log.action
                  ?.toLowerCase()
                  .includes(logSearchTerm.toLowerCase()) ||
                log.details
                  ?.toLowerCase()
                  .includes(logSearchTerm.toLowerCase()) ||
                log.adminId?.name
                  ?.toLowerCase()
                  .includes(logSearchTerm.toLowerCase()) ||
                log.adminId?.email
                  ?.toLowerCase()
                  .includes(logSearchTerm.toLowerCase());

              return matchesSearch;
            });

            return filteredLogs.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {activityLogs.length === 0
                  ? "No activity logs found."
                  : "No logs match your search criteria."}
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Showing {filteredLogs.length} of {activityLogs.length} logs
                </div>
                {filteredLogs.map((log: any) => (
                  <div
                    key={log._id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <p className="font-medium">{log.action}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {log.details}
                        </p>
                        {log.adminId && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            By:{" "}
                            {log.adminId.name || log.adminId.email || "Unknown"}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                        <div>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </Modal>

      {/* All Users Modal */}
      <Modal
        isOpen={showAllUsersModal}
        onClose={() => {
          setShowAllUsersModal(false);
          setAllUsers([]);
          setUserSearchTerm("");
          setUserFilter("all");
        }}
        title="All Users"
        size="xl"
      >
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, phone, or event..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none text-sm"
              />
            </div>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none text-sm"
            >
              <option value="all">All Users</option>
              <option value="with-ticket">With Ticket</option>
              <option value="without-ticket">Without Ticket</option>
            </select>
          </div>

          {(() => {
            // Filter and search logic
            let filteredUsers = allUsers.filter((user: any) => {
              const matchesSearch =
                user.name
                  ?.toLowerCase()
                  .includes(userSearchTerm.toLowerCase()) ||
                user.email
                  ?.toLowerCase()
                  .includes(userSearchTerm.toLowerCase()) ||
                user.phone?.includes(userSearchTerm) ||
                user.eventName
                  ?.toLowerCase()
                  .includes(userSearchTerm.toLowerCase());

              const matchesFilter =
                userFilter === "all" ||
                (userFilter === "with-ticket" && user.hasTicket) ||
                (userFilter === "without-ticket" && !user.hasTicket);

              return matchesSearch && matchesFilter;
            });

            return filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {allUsers.length === 0
                  ? "No users found."
                  : "No users match your search criteria."}
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Showing {filteredUsers.length} of {allUsers.length} users
                </div>
                {filteredUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            📱 {user.phone}
                          </p>
                        )}
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Event: {user.eventName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditUser(user)}
                          variant="secondary"
                          className="text-xs px-2 py-1"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          variant="danger"
                          className="text-xs px-2 py-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className={
                          user.hasTicket
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {user.hasTicket ? "✓ Has Ticket" : "⏳ No Ticket"}
                      </span>
                      {user.hasTicket && (
                        <>
                          <span className="text-gray-500">
                            Payment: {user.ticketStatus}
                          </span>
                          <span className="text-gray-500">
                            Scan: {user.scanStatus}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditUserModal}
        onClose={() => {
          setShowEditUserModal(false);
          setEditingUser(null);
          setUserForm({
            name: "",
            email: "",
            phone: "",
            password: "",
            eventId: "",
          });
        }}
        title="Edit User"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={userForm.email}
              onChange={(e) =>
                setUserForm({ ...userForm, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={userForm.phone}
              onChange={(e) =>
                setUserForm({ ...userForm, phone: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password{" "}
              <span className="text-xs text-gray-500">
                (leave blank to keep current)
              </span>
            </label>
            <input
              type="password"
              value={userForm.password}
              onChange={(e) =>
                setUserForm({ ...userForm, password: e.target.value })
              }
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Event Assignment
            </label>
            <select
              value={userForm.eventId}
              onChange={(e) =>
                setUserForm({ ...userForm, eventId: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" className="w-full">
            Update User
          </Button>
        </form>
      </Modal>
    </div>
  );
}
