import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Registration from "@/models/Registration"
import { verifyRazorpayPayment } from "@/utils/razorpay"
import { generateQRCode } from "@/utils/qrcode"

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await req.json()

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ message: "Order ID, payment ID, and signature are required" }, { status: 400 })
    }

    await connectDB()

    const registration = await Registration.findById(orderId)

    if (!registration) {
      return NextResponse.json({ message: "Registration not found" }, { status: 404 })
    }

    // Verify payment signature
    const isValid = verifyRazorpayPayment({
      orderId: registration.orderId,
      paymentId,
      signature,
    })

    if (!isValid) {
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 })
    }

    // Generate QR code
    const qrData = JSON.stringify({
      regId: registration._id.toString(),
      event: "techfest2025",
    })

    const qrCode = await generateQRCode(qrData)

    // Update registration
    registration.paymentId = paymentId
    registration.paymentVerified = true
    registration.qrCode = qrCode
    await registration.save()

    return NextResponse.json({
      message: "Payment verified successfully",
      registrationId: registration._id,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ message: "Failed to verify payment" }, { status: 500 })
  }
}
