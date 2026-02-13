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

    const { eventIds } = await request.json();

    const admin = await Admin.findByIdAndUpdate(
      params.id,
      { eventIds },
      { new: true },
    ).select("-password");

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
