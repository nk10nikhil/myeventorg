"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentPage() {
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (!orderId) {
      router.push("/register")
      return
    }

    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      fetchOrderDetails()
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [orderId, router])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/payment/order?orderId=${orderId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch order details")
      }

      setOrderDetails(data)
    } catch (error) {
      console.error("Error fetching order details:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load payment details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = () => {
    if (!orderDetails || !window.Razorpay) {
      toast({
        title: "Error",
        description: "Payment gateway not loaded. Please refresh the page.",
        variant: "destructive",
      })
      return
    }

    const options = {
      key: orderDetails.razorpayKeyId, // Use the key from the API
      amount: orderDetails.amount,
      currency: "INR",
      name: "TechFest 2025",
      description: "Event Registration",
      order_id: orderDetails.razorpayOrderId,
      handler: async (response: any) => {
        try {
          // Verify payment on the server
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          })

          const data = await verifyResponse.json()

          if (!verifyResponse.ok) {
            throw new Error(data.message || "Payment verification failed")
          }

          // Redirect to success page with registration ID
          router.push(`/registration-success?regId=${data.registrationId}`)
        } catch (error) {
          console.error("Payment verification error:", error)
          toast({
            title: "Payment Verification Failed",
            description: error instanceof Error ? error.message : "Something went wrong. Please contact support.",
            variant: "destructive",
          })
        }
      },
      prefill: {
        name: orderDetails.name,
        email: orderDetails.email,
        contact: orderDetails.phone,
      },
      theme: {
        color: "#3B82F6",
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading payment details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            You're almost there! Complete your payment to secure your spot at TechFest 2025.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm font-medium">Name:</div>
            <div className="text-sm">{orderDetails?.name}</div>
            <div className="text-sm font-medium">Email:</div>
            <div className="text-sm">{orderDetails?.email}</div>
            <div className="text-sm font-medium">Phone:</div>
            <div className="text-sm">{orderDetails?.phone}</div>
            <div className="text-sm font-medium">Amount:</div>
            <div className="text-sm">₹{(orderDetails?.amount / 100).toFixed(2)}</div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePayment} className="w-full">
            Pay Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
