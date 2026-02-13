import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import Entry from "@/models/Entry";
import ActivityLog from "@/models/ActivityLog";
import { getUserFromRequest } from "@/lib/middleware";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = getUserFromRequest(request);

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = params.id;

    // Find ticket
    const ticket = await Ticket.findOne({ userId });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Reset scan status
    ticket.scanStatus = "unused";
    ticket.scannedAt = undefined;
    ticket.scannedBy = undefined;
    ticket.scannedAtGate = undefined;
    await ticket.save();

    // Delete all entry records for this ticket
    await Entry.deleteMany({ ticketId: ticket._id });

    // Log activity
    await ActivityLog.create({
      adminId: admin.id,
      eventId: ticket.eventId,
      action: "RESET_QR",
      targetType: "ticket",
      targetId: ticket._id,
      details: `QR scan status reset for user ${userId}`,
    });

    return NextResponse.json({
      message: "QR scan status reset successfully",
    });
  } catch (error) {
    console.error("Reset QR error:", error);
    return NextResponse.json({ error: "Failed to reset QR" }, { status: 500 });
  }
}
