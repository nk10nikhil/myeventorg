import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/db"
import Registration from "@/models/Registration"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const registrations = await Registration.find({}).sort({ createdAt: -1 }).lean()

    return NextResponse.json(
      registrations.map((reg) => ({
        id: reg._id.toString(),
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        paymentVerified: reg.paymentVerified,
        qrUsed: reg.qrUsed,
        createdAt: reg.createdAt,
      })),
    )
  } catch (error) {
    console.error("Registrations fetch error:", error)
    return NextResponse.json({ message: "Failed to fetch registrations" }, { status: 500 })
  }
}
