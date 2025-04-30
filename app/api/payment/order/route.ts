import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Registration from "@/models/Registration"

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 })
    }

    await connectDB()

    const registration = await Registration.findById(orderId)

    if (!registration) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      amount: registration.amount,
      razorpayOrderId: registration.orderId,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID, // Add this line
    })
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch order details" }, { status: 500 })
  }
}
