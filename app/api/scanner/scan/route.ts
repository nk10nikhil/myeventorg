import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import Entry from "@/models/Entry";
import Event from "@/models/Event";
import { getUserFromRequest } from "@/lib/middleware";
import { validateQRExpiry } from "@/lib/qr";

export async function POST(request: NextRequest) {
  try {
    const admin = getUserFromRequest(request);

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { qrId, gateName, scannedOffline, deviceInfo } = await request.json();

    // Find ticket
    const ticket = await Ticket.findOne({ qrId })
      .populate("eventId")
      .populate("userId", "name email phone");

    if (!ticket) {
      return NextResponse.json(
        { error: "Invalid QR code", status: "invalid" },
        { status: 404 },
      );
    }

    // Check if already scanned
    if (ticket.scanStatus === "used") {
      return NextResponse.json(
        {
          error: "Ticket already used",
          status: "already-used",
          scannedAt: ticket.scannedAt,
          scannedAtGate: ticket.scannedAtGate,
        },
        { status: 400 },
      );
    }

    // Validate QR expiry
    const event = ticket.eventId as any;
    const isValid = validateQRExpiry(
      event.qrValidityStart,
      event.qrValidityEnd,
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "QR code expired or not yet valid", status: "expired" },
        { status: 400 },
      );
    }

    // Mark ticket as used
    ticket.scanStatus = "used";
    ticket.scannedAt = new Date();
    ticket.scannedBy = admin.id as any;
    ticket.scannedAtGate = gateName;
    await ticket.save();

    // Create entry record
    await Entry.create({
      ticketId: ticket._id,
      userId: ticket.userId,
      eventId: ticket.eventId,
      entryTime: new Date(),
      gateName,
      scannedBy: admin.id,
      scannedOffline: scannedOffline || false,
      syncedAt: scannedOffline ? undefined : new Date(),
      deviceInfo,
    });

    const populatedTicket = ticket as any;
    return NextResponse.json({
      message: "Entry granted",
      status: "success",
      ticket: {
        id: ticket._id,
        userName: populatedTicket.userId?.name || "Unknown",
        userEmail: populatedTicket.userId?.email || "",
        eventName: event.name,
        scannedAt: ticket.scannedAt,
        gateName: ticket.scannedAtGate,
      },
    });
  } catch (error) {
    console.error("Scan QR error:", error);
    return NextResponse.json(
      { error: "Scan failed", status: "error" },
      { status: 500 },
    );
  }
}
