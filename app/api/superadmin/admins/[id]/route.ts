import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { getUserFromRequest } from "@/lib/middleware";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const superAdmin = getUserFromRequest(request);

    if (!superAdmin || superAdmin.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    await Admin.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete admin error:", error);
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const superAdmin = getUserFromRequest(request);

    if (!superAdmin || superAdmin.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { name, email, password, eventIds } = await request.json();

    // Build update object
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (eventIds) updateData.eventIds = eventIds;

    // Only update password if provided
    if (password) {
      const { hashPassword } = await import("@/lib/auth");
      updateData.password = await hashPassword(password);
    }

    const admin = await Admin.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Admin updated successfully",
      admin,
    });
  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 },
    );
  }
}
