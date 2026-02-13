import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Ticket from "@/models/Ticket";
import Entry from "@/models/Entry";
import { getUserFromRequest } from "@/lib/middleware";
import bcrypt from "bcryptjs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const targetUser = await User.findById(params.id)
      .select("-password")
      .populate("eventId");
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ticket = await Ticket.findOne({ userId: params.id });
    const entries = await Entry.find({ userId: params.id });

    return NextResponse.json({
      user: {
        ...targetUser.toObject(),
        ticket,
        entries,
      },
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { name, email, phone, password, eventId } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is already taken by another user
    if (email !== targetUser.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 },
        );
      }
    }

    // Update user fields
    targetUser.name = name;
    targetUser.email = email;
    if (phone) targetUser.phone = phone;
    if (eventId) targetUser.eventId = eventId;

    // Update password if provided
    if (password && password.length > 0) {
      targetUser.password = await bcrypt.hash(password, 10);
    }

    await targetUser.save();

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone,
        eventId: targetUser.eventId,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const targetUser = await User.findById(params.id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete associated tickets and entries
    await Ticket.deleteMany({ userId: params.id });
    await Entry.deleteMany({ userId: params.id });

    // Delete user
    await User.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
