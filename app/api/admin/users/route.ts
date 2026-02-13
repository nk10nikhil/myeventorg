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

    // Verify admin has access to this event
    if (admin.eventIds && !admin.eventIds.includes(eventId)) {
      return NextResponse.json(
        { error: "Not authorized to view this event" },
        { status: 403 },
      );
    }

    // Get all users for this event
    const users = await User.find({ eventId }).select("-password");

    console.log(
      `[Admin Users] Found ${users.length} users for event ${eventId}`,
    );

    // Get ticket and entry info for each user
    const usersWithTickets = await Promise.all(
      users.map(async (user) => {
        const ticket = await Ticket.findOne({ userId: user._id, eventId });
        const entries = await Entry.find({ userId: user._id, eventId }).sort({
          entryTime: -1,
        });

        return {
          ...user.toObject(),
          ticket: ticket
            ? {
                id: ticket._id,
                qrId: ticket.qrId,
                paymentStatus: ticket.paymentStatus,
                scanStatus: ticket.scanStatus,
                scannedAt: ticket.scannedAt,
                scannedAtGate: ticket.scannedAtGate,
              }
            : null,
          entries: entries.map((entry) => ({
            id: entry._id,
            entryTime: entry.entryTime,
            gateName: entry.gateName,
            scannedOffline: entry.scannedOffline,
          })),
        };
      }),
    );

    console.log(
      `[Admin Users] Returning ${usersWithTickets.length} users with tickets`,
    );

    return NextResponse.json({ users: usersWithTickets });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
