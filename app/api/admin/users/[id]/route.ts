import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import Entry from "@/models/Entry";
import ActivityLog from "@/models/ActivityLog";
import { getUserFromRequest } from "@/lib/middleware";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const admin = getUserFromRequest(request);

    if (!admin || (admin.role !== "admin" && admin.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = params.id;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete related data
    const ticket = await Ticket.findOne({ userId });
    if (ticket) {
      await Entry.deleteMany({ ticketId: ticket._id });
      await Ticket.deleteOne({ _id: ticket._id });
    }

    // Delete user
    await User.deleteOne({ _id: userId });

    // Log activity
    await ActivityLog.create({
      adminId: admin.id,
      eventId: user.eventId,
      action: "DELETE_USER",
      targetType: "user",
      targetId: userId,
      details: `User ${user.name} (${user.email}) deleted`,
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
