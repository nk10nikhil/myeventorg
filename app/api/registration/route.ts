import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Registration from "@/models/Registration"

export async function GET(req: NextRequest) {
  try {
    const regId = req.nextUrl.searchParams.get("regId")

    if (!regId) {
      return NextResponse.json({ message: "Registration ID is required" }, { status: 400 })
    }

    await connectDB()

    const registration = await Registration.findById(regId)

    if (!registration) {
      return NextResponse.json({ message: "Registration not found" }, { status: 404 })
    }

    if (!registration.paymentVerified) {
      return NextResponse.json({ message: "Payment not verified" }, { status: 400 })
    }

    return NextResponse.json({
      id: registration._id,
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      qrCode: registration.qrCode,
      qrUsed: registration.qrUsed,
    })
  } catch (error) {
    console.error("Registration fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch registration details" }, { status: 500 })
  }
}
