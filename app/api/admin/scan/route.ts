import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/db"
import Registration from "@/models/Registration"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { regId } = await req.json()

    if (!regId) {
      return NextResponse.json({ message: "Registration ID is required" }, { status: 400 })
    }

    const registration = await Registration.findById(regId)

    if (!registration) {
      return NextResponse.json({ message: "Registration not found" }, { status: 404 })
    }

    if (!registration.paymentVerified) {
      return NextResponse.json({ message: "Payment not verified" }, { status: 400 })
    }

    if (registration.qrUsed) {
      return NextResponse.json({ message: "QR code already used" }, { status: 400 })
    }

    // Mark QR as used
    registration.qrUsed = true
    await registration.save()

    return NextResponse.json({
      message: "Check-in successful",
      registration: {
        id: registration._id.toString(),
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
      },
    })
  } catch (error) {
    console.error("QR scan error:", error)
    return NextResponse.json({ message: "Failed to process QR code" }, { status: 500 })
  }
}
