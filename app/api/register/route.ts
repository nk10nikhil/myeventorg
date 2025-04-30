import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Registration from "@/models/Registration"
import { createRazorpayOrder } from "@/utils/razorpay"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json()

    // Validate input
    if (!name || !email || !phone) {
      return NextResponse.json({ message: "Name, email, and phone are required" }, { status: 400 })
    }

    await connectDB()

    // Check if user already registered
    const existingRegistration = await Registration.findOne({ email })
    if (existingRegistration && existingRegistration.paymentVerified) {
      return NextResponse.json({ message: "You are already registered for this event" }, { status: 400 })
    }

    // Create Razorpay order
    const amount = 99900 // ₹999 in paise
    const order = await createRazorpayOrder(amount)

    // Create or update registration
    let registration
    if (existingRegistration) {
      registration = existingRegistration
      registration.name = name
      registration.phone = phone
      registration.orderId = order.id
      registration.amount = amount
      registration.paymentVerified = false
      await registration.save()
    } else {
      registration = await Registration.create({
        name,
        email,
        phone,
        orderId: order.id,
        amount,
        paymentVerified: false,
      })
    }

    return NextResponse.json({
      message: "Registration initiated",
      orderId: registration._id,
      razorpayOrderId: order.id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Failed to process registration" }, { status: 500 })
  }
}
