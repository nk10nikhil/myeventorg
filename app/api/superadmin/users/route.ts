import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";
import { getUserFromRequest } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all users with their event and ticket information
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithDetails = await Promise.all(
      users.map(async (user: any) => {
        const event = await Event.findById(user.eventId);
        const ticket = await Ticket.findOne({ userId: user._id });

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
          eventId: user.eventId,
          eventName: event?.name || "N/A",
          hasTicket: !!ticket,
          ticketStatus: ticket?.paymentStatus || "N/A",
          scanStatus: ticket?.scanStatus || "N/A",
        };
      }),
    );

    return NextResponse.json({ users: usersWithDetails });
  } catch (error) {
    console.error("Fetch all users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
