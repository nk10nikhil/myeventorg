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

    const { regIds } = await req.json()

    if (!regIds || !Array.isArray(regIds) || regIds.length === 0) {
      return NextResponse.json({ message: "Registration IDs are required" }, { status: 400 })
    }

    // Process each registration ID
    const results = {
      processed: 0,
      failed: 0,
      notFound: 0,
      alreadyScanned: 0,
      notPaid: 0,
    }

    for (const regId of regIds) {
      try {
        const registration = await Registration.findById(regId)

        if (!registration) {
          results.notFound++
          continue
        }

        if (!registration.paymentVerified) {
          results.notPaid++
          continue
        }

        if (registration.qrUsed) {
          results.alreadyScanned++
          continue
        }

        // Mark QR as used
        registration.qrUsed = true
        await registration.save()
        results.processed++
      } catch (error) {
        console.error(`Error processing registration ${regId}:`, error)
        results.failed++
      }
    }

    return NextResponse.json({
      message: "Bulk scan processed",
      ...results,
    })
  } catch (error) {
    console.error("Bulk scan error:", error)
    return NextResponse.json({ message: "Failed to process bulk scan" }, { status: 500 })
  }
}
