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

    console.log(
      `[Sync] Starting sync of ${offlineScans.length} offline scans for admin ${admin.id}`,
    );

    const results: {
      synced: { qrId: string }[];
      failed: { qrId: string; reason: string }[];
      duplicates: { qrId: string; reason: string }[];
    } = {
      synced: [],
      failed: [],
      duplicates: [],
    };

    for (const scan of offlineScans) {
      try {
        const { qrId, gateName, scannedAt, deviceInfo } = scan;

        if (!qrId || !gateName || !scannedAt) {
          results.failed.push({
            qrId: qrId || "unknown",
            reason: "Missing required fields",
          });
          continue;
        }

        // Check if ticket exists
        const ticket = await Ticket.findOne({ qrId }).populate("eventId");

        if (!ticket) {
          console.log(`[Sync] Ticket not found: ${qrId}`);
          results.failed.push({ qrId, reason: "Ticket not found" });
          continue;
        }

        // Check if already synced (exact match by time and gate)
        const existingEntry = await Entry.findOne({
          ticketId: ticket._id,
          entryTime: new Date(scannedAt),
          gateName: gateName,
        });

        if (existingEntry) {
          console.log(`[Sync] Duplicate entry: ${qrId}`);
          results.duplicates.push({ qrId, reason: "Already synced" });
          continue;
        }

        // Check if ticket was already used before this offline scan
        if (
          ticket.scanStatus === "used" &&
          ticket.scannedAt &&
          ticket.scannedAt < new Date(scannedAt)
        ) {
          console.log(
            `[Sync] Ticket ${qrId} was already used at ${ticket.scannedAtGate} before this offline scan`,
          );
          results.duplicates.push({
            qrId,
            reason: `Already used at ${ticket.scannedAtGate}`,
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
          console.log(`[Sync] Updated ticket status: ${qrId}`);
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

        console.log(`[Sync] Created entry for: ${qrId}`);
        results.synced.push({ qrId });
      } catch (error) {
        console.error(`[Sync] Error processing scan ${scan.qrId}:`, error);
        results.failed.push({ qrId: scan.qrId, reason: "Sync error" });
      }
    }

    console.log(
      `[Sync] Complete - Synced: ${results.synced.length}, Failed: ${results.failed.length}, Duplicates: ${results.duplicates.length}`,
    );

    return NextResponse.json({
      message: "Sync completed",
      results,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
