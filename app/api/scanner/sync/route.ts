import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import Entry from "@/models/Entry";
import { getUserFromRequest } from "@/lib/middleware";

export async function POST(request: NextRequest) {
  try {
    const admin = getUserFromRequest(request);

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { offlineScans } = await request.json();

    if (!Array.isArray(offlineScans)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    const results = {
      synced: [],
      failed: [],
      duplicates: [],
    };

    for (const scan of offlineScans) {
      try {
        const { qrId, gateName, scannedAt, deviceInfo } = scan;

        // Check if ticket exists
        const ticket = await Ticket.findOne({ qrId });

        if (!ticket) {
          results.failed.push({ qrId, reason: "Ticket not found" });
          continue;
        }

        // Check if already synced
        const existingEntry = await Entry.findOne({
          ticketId: ticket._id,
          entryTime: new Date(scannedAt),
        });

        if (existingEntry) {
          results.duplicates.push({ qrId, reason: "Already synced" });
          continue;
        }

        // Check if ticket was already used before this offline scan
        if (
          ticket.scanStatus === "used" &&
          ticket.scannedAt! < new Date(scannedAt)
        ) {
          results.duplicates.push({
            qrId,
            reason: "Ticket already used at different location",
          });
          continue;
        }

        // Update ticket if not already updated
        if (ticket.scanStatus === "unused") {
          ticket.scanStatus = "used";
          ticket.scannedAt = new Date(scannedAt);
          ticket.scannedBy = admin.id as any;
          ticket.scannedAtGate = gateName;
          await ticket.save();
        }

        // Create entry record
        await Entry.create({
          ticketId: ticket._id,
          userId: ticket.userId,
          eventId: ticket.eventId,
          entryTime: new Date(scannedAt),
          gateName,
          scannedBy: admin.id,
          scannedOffline: true,
          syncedAt: new Date(),
          deviceInfo,
        });

        results.synced.push({ qrId });
      } catch (error) {
        results.failed.push({ qrId: scan.qrId, reason: "Sync error" });
      }
    }

    return NextResponse.json({
      message: "Sync completed",
      results,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
