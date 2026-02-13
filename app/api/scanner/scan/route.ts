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

    if (!qrId || !gateName) {
      return NextResponse.json(
        { error: "QR ID and gate name are required" },
        { status: 400 },
      );
    }

    // Find ticket with lock to prevent race conditions
    const ticket = await Ticket.findOne({ qrId })
      .populate("eventId")
      .populate("userId", "name email phone");

    if (!ticket) {
      return NextResponse.json(
        { error: "Invalid QR code", status: "invalid" },
        { status: 404 },
      );
    }

    // Check if already scanned (CRITICAL: Check before any updates)
    if (ticket.scanStatus === "used") {
      // Check if this is a duplicate scan from the same gate within 1 minute
      const recentEntry = await Entry.findOne({
        ticketId: ticket._id,
        gateName,
      }).sort({ entryTime: -1 });

      if (recentEntry) {
        const timeDiff = Date.now() - recentEntry.entryTime.getTime();
        if (timeDiff < 60000) {
          // Less than 1 minute, likely duplicate scan
          return NextResponse.json(
            {
              error: "Ticket just scanned. Please wait",
              status: "duplicate-scan",
              scannedAt: recentEntry.entryTime,
              scannedAtGate: gateName,
            },
            { status: 400 },
          );
        }
      }

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

    // Mark ticket as used (atomic operation)
    const updateResult = await Ticket.updateOne(
      { _id: ticket._id, scanStatus: "unused" }, // Only update if still unused
      {
        $set: {
          scanStatus: "used",
          scannedAt: new Date(),
          scannedBy: admin.id,
          scannedAtGate: gateName,
        },
      },
    );

    if (updateResult.modifiedCount === 0) {
      // Ticket was already updated by another request
      return NextResponse.json(
        {
          error: "Ticket already scanned by another device",
          status: "already-used",
        },
        { status: 400 },
      );
    }

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
        scannedAt: new Date(),
        gateName: gateName,
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
