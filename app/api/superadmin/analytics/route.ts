import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import Entry from "@/models/Entry";
import { getUserFromRequest } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const superAdmin = getUserFromRequest(request);

    if (!superAdmin || superAdmin.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const events = await Event.find();

    const analytics = await Promise.all(
      events.map(async (event) => {
        const totalUsers = await User.countDocuments({ eventId: event._id });
        const totalTickets = await Ticket.countDocuments({
          eventId: event._id,
          paymentStatus: "completed",
        });
        const checkedIn = await Ticket.countDocuments({
          eventId: event._id,
          scanStatus: "used",
        });

        const entries = await Entry.find({ eventId: event._id });

        // Calculate peak entry time
        const hourlyEntries: { [key: string]: number } = {};
        entries.forEach((entry) => {
          const hour = new Date(entry.entryTime).getHours();
          hourlyEntries[hour] = (hourlyEntries[hour] || 0) + 1;
        });

        return {
          eventId: event._id,
          eventName: event.name,
          totalUsers,
          totalTickets,
          checkedIn,
          remaining: totalTickets - checkedIn,
          revenue: totalTickets * event.ticketPrice,
          checkInRate: totalTickets > 0 ? (checkedIn / totalTickets) * 100 : 0,
          hourlyEntries,
        };
      }),
    );

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Fetch analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
