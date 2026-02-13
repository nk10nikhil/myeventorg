"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  WifiOff,
  Wifi,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import QRScanner from "@/components/QRScanner";
import Toast from "@/components/Toast";
import Loader from "@/components/Loader";

export default function AdminScanner() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [gateName, setGateName] = useState("Gate A");
  const [offlineScans, setOfflineScans] = useState<any[]>([]);
  const [scanResult, setScanResult] = useState<any>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    checkAuth();
    checkOnlineStatus();

    // Load offline scans from localStorage
    const stored = localStorage.getItem("offlineScans");
    if (stored) {
      setOfflineScans(JSON.parse(stored));
    }

    // Listen for online/offline events
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.user || data.user.role !== "admin") {
        router.push("/admin");
        return;
      }

      setAdmin(data.user);
      setLoading(false);
    } catch (error) {
      router.push("/admin");
    }
  };

  const checkOnlineStatus = () => {
    setIsOnline(navigator.onLine);
  };

  const handleScan = async (qrData: string) => {
    try {
      console.log("Raw QR data:", qrData);

      // Try to parse as JSON
      let qrId: string;
      try {
        const data = JSON.parse(qrData);
        qrId = data.qrId;

        if (!qrId) {
          showScanResult("error", "Invalid QR code: Missing qrId");
          return;
        }
      } catch (parseError) {
        // If not JSON, try to use the data directly as qrId
        // This handles cases where QR might contain just the ID
        if (typeof qrData === "string" && qrData.trim().length > 0) {
          qrId = qrData.trim();
        } else {
          showScanResult("error", "Invalid QR code format");
          return;
        }
      }

      console.log("Extracted qrId:", qrId);

      if (isOnline) {
        // Online scan
        await scanOnline(qrId);
      } else {
        // Offline scan
        scanOffline(qrId);
      }
    } catch (error: any) {
      console.error("QR scan error:", error);
      showScanResult("error", error.message || "Failed to process QR code");
    }
  };

  const scanOnline = async (qrId: string) => {
    try {
      console.log("Scanning online with qrId:", qrId);

      const res = await fetch("/api/scanner/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrId,
          gateName,
          scannedOffline: false,
          deviceInfo: navigator.userAgent,
        }),
      });

      const data = await res.json();
      console.log("Scan response:", data);

      if (data.status === "success") {
        showScanResult(
          "success",
          `Entry granted! Welcome ${data.ticket?.userName || "Guest"}`,
        );
      } else if (data.status === "already-used") {
        showScanResult(
          "error",
          `Already used at ${data.scannedAtGate || "unknown gate"} on ${data.scannedAt ? new Date(data.scannedAt).toLocaleString() : "unknown time"}`,
        );
      } else if (data.status === "invalid") {
        showScanResult("error", "Invalid QR code - Ticket not found");
      } else if (data.status === "expired") {
        showScanResult("error", "QR code expired or not yet valid");
      } else {
        showScanResult("error", data.error || "Entry denied");
      }
    } catch (error: any) {
      console.error("Online scan error:", error);
      showScanResult(
        "error",
        error.message || "Scan failed - Please check connection",
      );
    }
  };

  const scanOffline = (qrId: string) => {
    // Check if already scanned offline
    const exists = offlineScans.find((scan) => scan.qrId === qrId);
    if (exists) {
      showScanResult("error", "Already scanned (offline)");
      return;
    }

    // Store offline scan
    const scan = {
      qrId,
      gateName,
      scannedAt: new Date().toISOString(),
      deviceInfo: navigator.userAgent,
    };

    const updatedScans = [...offlineScans, scan];
    setOfflineScans(updatedScans);
    localStorage.setItem("offlineScans", JSON.stringify(updatedScans));

    showScanResult("success", "Entry granted (offline)");
  };

  const showScanResult = (status: "success" | "error", message: string) => {
    setScanResult({ status, message });

    // Vibrate
    if (navigator.vibrate) {
      if (status === "success") {
        navigator.vibrate([200, 100, 200]);
      } else {
        navigator.vibrate(500);
      }
    }

    // Play sound
    const audio = new Audio(
      status === "success"
        ? "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR4P..."
        : "data:audio/wav;base64,UklGRmQBAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNTguMjkuMTAwAGRhdGEAAQAAAAEA...",
    );
    audio.play().catch(() => {});

    setTimeout(() => {
      setScanResult(null);
    }, 3000);
  };

  const syncOfflineScans = async () => {
    if (offlineScans.length === 0) {
      setToast({ message: "No offline scans to sync", type: "info" });
      return;
    }

    setSyncing(true);

    try {
      const res = await fetch("/api/scanner/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offlineScans }),
      });

      const data = await res.json();

      setToast({
        message: `Synced ${data.results.synced.length} scans, ${data.results.failed.length} failed`,
        type: "success",
      });

      // Clear synced scans
      setOfflineScans([]);
      localStorage.removeItem("offlineScans");
    } catch (error) {
      setToast({ message: "Sync failed", type: "error" });
    } finally {
      setSyncing(false);
    }
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

      {/* Scan Result Overlay */}
      <AnimatePresence>
        {scanResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={`p-12 rounded-2xl ${
                scanResult.status === "success"
                  ? "bg-green-500 border-8 border-green-400"
                  : "bg-red-500 border-8 border-red-400"
              } shadow-2xl`}
            >
              {scanResult.status === "success" ? (
                <CheckCircle2 className="w-32 h-32 text-white mx-auto mb-4" />
              ) : (
                <XCircle className="w-32 h-32 text-white mx-auto mb-4" />
              )}
              <p className="text-3xl font-bold text-white text-center">
                {scanResult.message}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              {isOnline ? (
                <div className="flex items-center gap-2 text-green-500">
                  <Wifi className="w-5 h-5" />
                  <span className="text-sm font-medium">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-500">
                  <WifiOff className="w-5 h-5" />
                  <span className="text-sm font-medium">Offline</span>
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Gate Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Gate
            </label>
            <select
              value={gateName}
              onChange={(e) => setGateName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="Gate A">Gate A</option>
              <option value="Gate B">Gate B</option>
              <option value="Gate C">Gate C</option>
              <option value="Main Entrance">Main Entrance</option>
              <option value="VIP Entrance">VIP Entrance</option>
            </select>
          </div>

          {/* Scanner */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
            <QRScanner
              onScan={handleScan}
              onError={(error) => setToast({ message: error, type: "error" })}
            />
          </div>

          {/* Offline Scans */}
          {!isOnline && offlineScans.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  Offline Scans ({offlineScans.length})
                </h3>
                <Button
                  onClick={syncOfflineScans}
                  loading={syncing}
                  disabled={!isOnline}
                  variant="secondary"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {offlineScans.map((scan, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
                  >
                    <p>
                      <strong>QR ID:</strong> {scan.qrId.slice(0, 8)}...
                    </p>
                    <p>
                      <strong>Gate:</strong> {scan.gateName}
                    </p>
                    <p>
                      <strong>Time:</strong>{" "}
                      {new Date(scan.scannedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isOnline && offlineScans.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                You have {offlineScans.length} offline scan(s) pending sync
              </p>
              <Button
                onClick={syncOfflineScans}
                loading={syncing}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4" />
                Sync Now
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
