import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { getUserFromRequest } from "@/lib/middleware";
import { hashPassword } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const superAdmin = getUserFromRequest(request);

    if (!superAdmin || superAdmin.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const admins = await Admin.find().populate("eventIds").select("-password");

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Fetch admins error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const superAdmin = getUserFromRequest(request);

    if (!superAdmin || superAdmin.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { name, email, password, eventIds } = await request.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      eventIds: eventIds || [],
    });

    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          eventIds: admin.eventIds,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 },
    );
  }
}
