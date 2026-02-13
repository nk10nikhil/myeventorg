import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import Entry from "@/models/Entry";
import { getUserFromRequest } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const admin = getUserFromRequest(request);

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "Event ID required" }, { status: 400 });
    }

    // Get stats
    const totalRegistered = await User.countDocuments({ eventId });
    const totalTickets = await Ticket.countDocuments({
      eventId,
      paymentStatus: "completed",
    });
    const checkedIn = await Ticket.countDocuments({
      eventId,
      scanStatus: "used",
    });
    const remaining = totalTickets - checkedIn;

    // Get recent entries
    const recentEntries = await Entry.find({ eventId })
      .populate("userId", "name email")
      .sort({ entryTime: -1 })
      .limit(10);

    return NextResponse.json({
      stats: {
        totalRegistered,
        totalTickets,
        checkedIn,
        remaining,
      },
      recentEntries,
    });
  } catch (error) {
    console.error("Fetch dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
