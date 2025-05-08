"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Camera, CheckCircle, Loader2, RefreshCw, Smartphone, WifiOff, Volume2, VolumeX } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import AdminLayout from "@/components/admin-layout"
import ClientOnly from "@/components/client-only"
import confetti from "canvas-confetti"

// Configure page as server-side only
export const dynamic = 'force-dynamic'

export default function ScanPage() {
  return (
    <ClientOnly>
      <ScanPageContent />
    </ClientOnly>
  )
}

// Main component content
function ScanPageContent() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Handle redirect on client-side only
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    },
  })

  const [scanning, setScanning] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [scannerReady, setScannerReady] = useState(false)
  const [sound, setSound] = useState(true)
  const [isSoundLoaded, setIsSoundLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrScannerRef = useRef<any>(null)
  const QrScannerClassRef = useRef<any>(null)
  const successSoundRef = useRef<HTMLAudioElement | null>(null)
  const errorSoundRef = useRef<HTMLAudioElement | null>(null)
  const offlineScans = useRef<string[]>([])

  useEffect(() => {
    // Load QR scanner dynamically without using useState
    const loadQrScanner = async () => {
      try {
        const QrScannerModule = await import('qr-scanner');
        QrScannerClassRef.current = QrScannerModule.default;
        setScannerReady(true);
      } catch (error) {
        console.error('Failed to load QR scanner module:', error);
        setCameraError(true);
      }
    };

    loadQrScanner();

    // Initialize audio elements
    successSoundRef.current = new Audio('/sounds/success.mp3')
    errorSoundRef.current = new Audio('/sounds/error.mp3')
    setIsSoundLoaded(true)

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy()
      }
    }
  }, [])

  const startScanner = async () => {
    if (!QrScannerClassRef.current || !videoRef.current) return

    setScanning(true)
    setScanResult(null)
    setCameraError(false)

    try {
      qrScannerRef.current = new QrScannerClassRef.current(
        videoRef.current,
        (result: any) => handleScan(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          returnDetailedScanResult: true,
        }
      )

      await qrScannerRef.current.start()
    } catch (error) {
      console.error('Failed to start scanner:', error)
      setCameraError(true)
      setScanning(false)
    }
  }

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.destroy()
      qrScannerRef.current = null
    }
    setScanning(false)
  }

  const handleScan = async (qrData: string) => {
    try {
      stopScanner()
      const data = JSON.parse(qrData)

      if (!data.regId || !data.event) {
        throw new Error('Invalid QR code')
      }

      if (offlineMode) {
        // Check if already scanned in offline mode
        if (offlineScans.current.includes(data.regId)) {
          handleScanResult({
            success: false,
            message: 'This QR code has already been scanned in offline mode',
          })
          return
        }

        // Add to offline scans
        offlineScans.current.push(data.regId)

        handleScanResult({
          success: true,
          message: 'Attendee checked in (offline mode)',
          registration: {
            id: data.regId,
            name: 'Offline Attendee',
            email: 'Saved for later sync',
            phone: 'Saved for later sync',
          },
        })
        return
      }

      const response = await fetch('/api/admin/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ regId: data.regId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to process QR code')
      }

      handleScanResult({
        success: true,
        message: result.message,
        registration: result.registration,
      })

    } catch (error) {
      console.error('Error processing scan:', error)

      const errorMessage = error instanceof Error ? error.message : 'Failed to process QR code'
      handleScanResult({
        success: false,
        message: errorMessage,
      })
    }
  }

  const handleScanResult = (result: any) => {
    setScanResult(result)

    // Play appropriate sound if enabled
    if (sound && isSoundLoaded) {
      if (result.success) {
        successSoundRef.current?.play()
        // Trigger confetti for successful scan
        triggerConfetti()
      } else {
        errorSoundRef.current?.play()
      }
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  const syncOfflineScans = async () => {
    if (offlineScans.current.length === 0) {
      toast({
        title: 'No offline scans',
        description: 'There are no offline scans to sync',
      })
      return
    }

    try {
      const response = await fetch('/api/admin/bulk-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ regIds: offlineScans.current }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to sync offline scans')
      }

      toast({
        title: 'Sync Successful',
        description: `Processed: ${result.processed}, Failed: ${result.failed}, Already Scanned: ${result.alreadyScanned}, Not Paid: ${result.notPaid}, Not Found: ${result.notFound}`,
      })

      // Clear offline scans
      offlineScans.current = []
    } catch (error) {
      console.error('Error syncing offline scans:', error)
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Failed to sync offline scans',
        variant: 'destructive',
      })
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">QR Code Scanner</h1>
            <p className="text-muted-foreground animate-fade-in">Scan attendee QR codes to check them in for the event.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="animate-slide-in-left">
              <CardHeader>
                <CardTitle>Scanner</CardTitle>
                <CardDescription>Scan the QR code from the attendee's ticket.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video overflow-hidden rounded-lg border relative">
                  {scanning ? (
                    <video
                      ref={videoRef}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20">
                      <Camera className="h-10 w-10 mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        {cameraError ? 'Camera access denied or device not available' : 'Camera is currently off'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="offline-mode"
                        checked={offlineMode}
                        onCheckedChange={setOfflineMode}
                      />
                      <Label htmlFor="offline-mode" className="text-sm font-medium flex items-center">
                        {offlineMode ? (
                          <WifiOff className="mr-1 h-4 w-4 text-amber-500" />
                        ) : (
                          <Smartphone className="mr-1 h-4 w-4 text-green-500" />
                        )}
                        Offline Mode {offlineMode && <span className="text-xs text-muted-foreground ml-1">(Scans: {offlineScans.current.length})</span>}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sound-toggle"
                        checked={sound}
                        onCheckedChange={setSound}
                      />
                      <Label htmlFor="sound-toggle" className="text-sm font-medium flex items-center">
                        {sound ? (
                          <Volume2 className="mr-1 h-4 w-4 text-green-500" />
                        ) : (
                          <VolumeX className="mr-1 h-4 w-4 text-amber-500" />
                        )}
                        Sound
                      </Label>
                    </div>
                  </div>

                  {offlineMode && offlineScans.current.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={syncOfflineScans}
                      className="w-full"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync {offlineScans.current.length} Offline Scan{offlineScans.current.length > 1 ? 's' : ''}
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                {scanResult && (
                  <Alert
                    variant={scanResult.success ? 'default' : 'destructive'}
                    className={`w-full ${scanResult.success ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900'} transition-all duration-300 animate-bounce-in`}
                  >
                    <div className="flex items-center gap-2">
                      {scanResult.success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4" />}
                      <AlertTitle>{scanResult.success ? "Success" : "Error"}</AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">{scanResult.message}</AlertDescription>
                  </Alert>
                )}

                <div className="w-full flex justify-center gap-4">
                  {!scanning ? (
                    <Button onClick={startScanner} disabled={!scannerReady} className="bg-primary hover:bg-primary/90 relative overflow-hidden">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
                </div>
              </CardFooter>
            </Card>

            <div className="flex flex-col gap-6">
              <Card className="animate-slide-in-right">
                <CardHeader>
                  <CardTitle>Recent Scan</CardTitle>
                  <CardDescription>Details about the most recent scan.</CardDescription>
                </CardHeader>
                <CardContent>
                  {scanResult ? (
                    <>
                      {scanResult.success && scanResult.registration ? (
                        <div className="rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 shadow-sm border border-blue-100 dark:border-blue-900">
                          <h3 className="font-semibold text-lg mb-4 pb-2 border-b">Attendee Information</h3>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="font-medium">Name:</div>
                            <div className="col-span-2">{scanResult.registration.name}</div>
                            <div className="font-medium">Email:</div>
                            <div className="col-span-2 truncate">{scanResult.registration.email}</div>
                            <div className="font-medium">Phone:</div>
                            <div className="col-span-2">{scanResult.registration.phone}</div>
                            <div className="font-medium">Registration ID:</div>
                            <div className="col-span-2 text-xs truncate font-mono">{scanResult.registration.id}</div>
                            <div className="font-medium">Check-in Time:</div>
                            <div className="col-span-2">{new Date().toLocaleTimeString()}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                          <h3 className="font-medium text-destructive">Scan Error</h3>
                          <p className="text-sm text-muted-foreground">{scanResult.message}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No scans performed yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Start the scanner and scan a QR code</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle>Scanning Instructions</CardTitle>
                  <CardDescription>Tips for successful scanning.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Start the Scanner</h4>
                        <p className="text-sm text-muted-foreground">Click the "Start Scanner" button to activate your device's camera.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Position the QR Code</h4>
                        <p className="text-sm text-muted-foreground">Position the attendee's QR code within the camera view. Keep it steady.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Verify Success</h4>
                        <p className="text-sm text-muted-foreground">Check that the attendee details are displayed correctly after scanning.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Offline Mode (If Needed)</h4>
                        <p className="text-sm text-muted-foreground">Use offline mode if internet connection is unstable. Sync later when connected.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Invisible container for confetti */}
      <div className="confetti-container" />
    </AdminLayout>
  )
}
