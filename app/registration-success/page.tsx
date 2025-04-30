"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, Download, Loader2 } from "lucide-react"

export default function RegistrationSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [registration, setRegistration] = useState<any>(null)
  const searchParams = useSearchParams()
  const regId = searchParams.get("regId")

  useEffect(() => {
    if (!regId) return

    const fetchRegistrationDetails = async () => {
      try {
        const response = await fetch(`/api/registration?regId=${regId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch registration details")
        }

        setRegistration(data)
      } catch (error) {
        console.error("Error fetching registration:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load registration details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrationDetails()
  }, [regId])

  const downloadQRCode = () => {
    if (!registration?.qrCode) return

    const link = document.createElement("a")
    link.href = registration.qrCode
    link.download = `techfest-2025-qr-${regId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading registration details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle>Registration Successful!</CardTitle>
          <CardDescription>
            Thank you for registering for TechFest 2025. Your registration has been confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm font-medium">Registration ID:</div>
            <div className="text-sm">{regId}</div>
            <div className="text-sm font-medium">Name:</div>
            <div className="text-sm">{registration?.name}</div>
            <div className="text-sm font-medium">Email:</div>
            <div className="text-sm">{registration?.email}</div>
            <div className="text-sm font-medium">Phone:</div>
            <div className="text-sm">{registration?.phone}</div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Your Entry QR Code</p>
              <p className="text-xs text-muted-foreground mb-4">
                Present this QR code at the event entrance for quick check-in
              </p>
              {registration?.qrCode ? (
                <div className="flex justify-center">
                  <img
                    src={registration.qrCode || "/placeholder.svg"}
                    alt="QR Code"
                    className="border rounded-lg p-2 max-w-[200px]"
                  />
                </div>
              ) : (
                <div className="text-sm text-red-500">QR code not available</div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={downloadQRCode} className="w-full" disabled={!registration?.qrCode}>
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
