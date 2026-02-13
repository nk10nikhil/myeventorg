import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import Event from "@/models/Event";
import { getUserFromRequest } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all tickets with populated user and event data
    const tickets = await Ticket.find({})
      .populate("userId", "name email phone")
      .populate("eventId", "name venue startDate")
      .sort({ createdAt: -1 });

    const ticketsData = tickets.map((ticket: any) => ({
      id: ticket._id,
      qrId: ticket.qrId,
      paymentStatus: ticket.paymentStatus,
      scanStatus: ticket.scanStatus,
      amount: ticket.amount,
      scannedAt: ticket.scannedAt,
      scannedAtGate: ticket.scannedAtGate,
      createdAt: ticket.createdAt,
      userName: ticket.userId?.name || "Unknown",
      userEmail: ticket.userId?.email || "N/A",
      userPhone: ticket.userId?.phone || "N/A",
      eventName: ticket.eventId?.name || "Unknown Event",
      eventVenue: ticket.eventId?.venue || "N/A",
    }));

    return NextResponse.json({ tickets: ticketsData });
  } catch (error) {
    console.error("Fetch all tickets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}
