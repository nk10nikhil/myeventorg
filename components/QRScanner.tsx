"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { motion } from "framer-motion";
import {
  Camera,
  Flashlight,
  FlashlightOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
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
  const [permissionError, setPermissionError] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeScanner();

    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current
          .stop()
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  const initializeScanner = async () => {
    try {
      // Request camera permissions first
      await navigator.mediaDevices.getUserMedia({ video: true });

      // Get available cameras
      const devices = await Html5Qrcode.getCameras();

      if (devices && devices.length) {
        setCameras(devices);

        // Prefer back camera
        const backCamera = devices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear") ||
            device.label.toLowerCase().includes("environment"),
        );

        setSelectedCamera(backCamera?.id || devices[0].id);
        setHasPermission(true);
        setPermissionError("");
      } else {
        setPermissionError("No cameras found on this device");
        onError?.("No cameras found on this device");
      }
    } catch (err: any) {
      console.error("Error initializing scanner:", err);
      const errorMsg =
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please grant camera access and refresh the page."
          : "Failed to access camera. Please check your browser settings.";
      setPermissionError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsInitializing(false);
    }
  };

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
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Successfully scanned - vibrate and call callback
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }

          console.log("QR Code scanned:", decodedText);
          onScan(decodedText);
        },
        (errorMessage) => {
          // Ignore continuous scanning errors (these happen when no QR in view)
          // Only log them in development
          if (process.env.NODE_ENV === "development") {
            console.debug("Scan attempt:", errorMessage);
          }
        },
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      onError?.(err.message || "Failed to start scanner. Please try again.");
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

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Initializing camera...</span>
      </div>
    );
  }

  if (permissionError) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-700 dark:text-gray-300 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Camera Access Required
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {permissionError}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={initializeScanner} className="w-full">
          Try Again
        </Button>
      </div>
    );
  }

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
