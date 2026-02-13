"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion } from "framer-motion";
import { Camera, Flashlight, FlashlightOff, Loader2 } from "lucide-react";
import Button from "./Button";

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Get available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          // Prefer back camera
          const backCamera = devices.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("rear"),
          );
          setSelectedCamera(backCamera?.id || devices[0].id);
          setHasPermission(true);
        }
      })
      .catch((err) => {
        console.error("Error getting cameras:", err);
        onError?.("Failed to access camera. Please grant camera permissions.");
      });

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  const startScanning = async () => {
    if (!selectedCamera) {
      onError?.("No camera selected");
      return;
    }

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Stop scanner and vibrate on successful scan
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }
          onScan(decodedText);
        },
        (errorMessage) => {
          // Ignore continuous scanning errors
        },
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      onError?.(err.message || "Failed to start scanner");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
        setFlashOn(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const toggleFlash = async () => {
    // Flash functionality is browser/device dependent
    // This is a placeholder for future implementation
    onError?.("Flash feature not available in this browser");
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-xl overflow-hidden aspect-square max-w-md mx-auto">
        <div id="qr-reader" className="w-full h-full"></div>

        {!isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm"
          >
            <Camera className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-white text-center px-4">
              Click start to begin scanning
            </p>
          </motion.div>
        )}

        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                {/* Scanning frame corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>

                {/* Scanning line animation */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-primary shadow-lg"
                  animate={{ top: ["0%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Camera selection */}
      {cameras.length > 1 && !isScanning && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Select Camera</label>
          <select
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary"
            aria-label="Select camera device"
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        {!isScanning ? (
          <Button
            onClick={startScanning}
            className="flex-1"
            disabled={!hasPermission}
          >
            <Camera className="w-5 h-5" />
            Start Scanning
          </Button>
        ) : (
          <>
            <Button onClick={stopScanning} variant="danger" className="flex-1">
              Stop Scanning
            </Button>
            <Button onClick={toggleFlash} variant="secondary">
              {flashOn ? (
                <FlashlightOff className="w-5 h-5" />
              ) : (
                <Flashlight className="w-5 h-5" />
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
