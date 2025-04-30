"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Camera, CheckCircle, Loader2, RefreshCw, Smartphone, WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import AdminLayout from "@/components/admin-layout"

export default function ScanPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<null | {
    success: boolean
    message: string
    registration?: any
  }>(null)
  const [QrScanner, setQrScanner] = useState<any>(null)
  const [scanner, setScanner] = useState<any>(null)
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)
  const [offlineMode, setOfflineMode] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [offlineScans, setOfflineScans] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    // Check if browser is online
    setIsOnline(navigator.onLine)
    window.addEventListener("online", () => setIsOnline(true))
    window.addEventListener("offline", () => setIsOnline(false))

    // Load offline scans from localStorage
    const savedScans = localStorage.getItem("offlineScans")
    if (savedScans) {
      setOfflineScans(JSON.parse(savedScans))
    }

    // Dynamically import QR scanner library
    import("qr-scanner").then((module) => {
      setQrScanner(() => module.default)

      // Get available cameras
      module.default
        .listCameras()
        .then((cameras: any[]) => {
          setCameras(cameras)
          if (cameras.length > 0) {
            setSelectedCamera(cameras[0].id)
          }
        })
        .catch(console.error)
    })

    return () => {
      if (scanner) {
        scanner.stop()
      }
      window.removeEventListener("online", () => setIsOnline(true))
      window.removeEventListener("offline", () => setIsOnline(false))
    }
  }, [status, router, scanner])

  const startScanner = () => {
    if (!QrScanner) return

    setScanning(true)
    setScanResult(null)

    const videoElement = videoRef.current

    if (!videoElement) return

    const qrScanner = new QrScanner(
      videoElement,
      async (result) => {
        // Don't stop scanner immediately to allow continuous scanning
        await processQrCode(result.data)
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        preferredCamera: selectedCamera || undefined,
        maxScansPerSecond: 1, // Limit scan rate to prevent duplicates
      },
    )

    setScanner(qrScanner)
    qrScanner.start().catch((error) => {
      console.error("Scanner start error:", error)
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check permissions.",
        variant: "destructive",
      })
      setScanning(false)
    })
  }

  const stopScanner = () => {
    if (scanner) {
      scanner.stop()
      setScanning(false)
    }
  }

  const processQrCode = async (qrData: string) => {
    try {
      // Parse QR data - assuming it's a JSON string with regId
      let regId
      try {
        const parsedData = JSON.parse(qrData)
        regId = parsedData.regId
      } catch (e) {
        // If not JSON, try to use the string directly
        regId = qrData
      }

      if (!regId) {
        throw new Error("Invalid QR code")
      }

      // Check if we've already scanned this QR code in this session
      if (scanResult?.registration?.id === regId && scanResult.success) {
        // Already scanned this QR code successfully in this session
        return
      }

      // If offline mode or browser is offline
      if (offlineMode || !isOnline) {
        // Check if already scanned offline
        if (offlineScans.includes(regId)) {
          setScanResult({
            success: false,
            message: "This QR code has already been scanned offline",
          })
          return
        }

        // Add to offline scans
        const updatedScans = [...offlineScans, regId]
        setOfflineScans(updatedScans)
        localStorage.setItem("offlineScans", JSON.stringify(updatedScans))

        setScanResult({
          success: true,
          message: "Offline check-in recorded. Will sync when online.",
          registration: {
            id: regId,
            name: "Offline Attendee",
            email: "Stored locally",
            phone: "Will sync when online",
          },
        })

        toast({
          title: "Offline Check-in",
          description: `Attendee with ID ${regId} has been checked in offline.`,
        })
        return
      }

      // Online mode - verify with server
      const response = await fetch("/api/admin/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ regId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to process QR code")
      }

      setScanResult({
        success: true,
        message: "Check-in successful!",
        registration: data.registration,
      })

      toast({
        title: "Check-in Successful",
        description: `${data.registration.name} has been checked in.`,
      })
    } catch (error) {
      console.error("QR scan error:", error)
      setScanResult({
        success: false,
        message: error instanceof Error ? error.message : "Invalid QR code",
      })

      toast({
        title: "Check-in Failed",
        description: error instanceof Error ? error.message : "Invalid QR code",
        variant: "destructive",
      })
    }
  }

  const syncOfflineScans = async () => {
    if (offlineScans.length === 0) return

    try {
      const response = await fetch("/api/admin/bulk-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ regIds: offlineScans }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to sync offline scans")
      }

      // Clear offline scans
      setOfflineScans([])
      localStorage.removeItem("offlineScans")

      toast({
        title: "Sync Successful",
        description: `${data.processed} attendees have been synced.`,
      })
    } catch (error) {
      console.error("Sync error:", error)
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to sync offline scans",
        variant: "destructive",
      })
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">QR Code Scanner</h1>
            <p className="text-muted-foreground">Scan attendee QR codes to check them in to the event.</p>
          </div>

          {!isOnline && (
            <Alert variant="warning" className="mb-4">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>You are offline</AlertTitle>
              <AlertDescription>
                Scanner will work in offline mode. Scans will be synced when you're back online.
              </AlertDescription>
            </Alert>
          )}

          {offlineScans.length > 0 && isOnline && (
            <Alert variant="info" className="mb-4">
              <Smartphone className="h-4 w-4" />
              <AlertTitle>Offline scans available</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span>You have {offlineScans.length} offline scans that need to be synced.</span>
                <Button size="sm" onClick={syncOfflineScans}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>Position the QR code within the camera view to scan.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline></video>
                {!scanning && !scanResult && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <p className="text-muted-foreground">Camera inactive</p>
                  </div>
                )}
              </div>

              {cameras.length > 1 && (
                <div className="w-full mb-4">
                  <label className="block text-sm font-medium mb-2">Select Camera</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedCamera || ""}
                    onChange={(e) => {
                      setSelectedCamera(e.target.value)
                      if (scanner) {
                        scanner.setCamera(e.target.value).catch(console.error)
                      }
                    }}
                    disabled={scanning}
                  >
                    {cameras.map((camera) => (
                      <option key={camera.id} value={camera.id}>
                        {camera.label || `Camera ${camera.id}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-2 mb-4 w-full">
                <Switch id="offline-mode" checked={offlineMode} onCheckedChange={setOfflineMode} disabled={!isOnline} />
                <Label htmlFor="offline-mode">Enable Offline Mode</Label>
              </div>

              {scanResult && (
                <Alert variant={scanResult.success ? "default" : "destructive"} className="mb-4 w-full">
                  {scanResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertTitle>{scanResult.success ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>{scanResult.message}</AlertDescription>
                </Alert>
              )}

              {scanResult && scanResult.success && scanResult.registration && (
                <div className="w-full p-4 border rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Attendee Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Name:</div>
                    <div>{scanResult.registration.name}</div>
                    <div className="font-medium">Email:</div>
                    <div>{scanResult.registration.email}</div>
                    <div className="font-medium">Phone:</div>
                    <div>{scanResult.registration.phone}</div>
                    <div className="font-medium">Registration ID:</div>
                    <div>{scanResult.registration.id}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              {!scanning ? (
                <Button onClick={startScanner} disabled={!QrScanner}>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Scanner
                </Button>
              ) : (
                <Button variant="outline" onClick={stopScanner}>
                  Stop Scanner
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
