import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SuperAdmin from "@/models/SuperAdmin";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if super admin already exists
    const existing = await SuperAdmin.findOne({});

    if (existing) {
      return NextResponse.json(
        { message: "Super Admin already initialized" },
        { status: 200 },
      );
    }

    // Create default super admin
    const hashedPassword = await hashPassword("nk10nikhil");

    await SuperAdmin.create({
      email: "nk10nikhil@gmail.com",
      password: hashedPassword,
      name: "Super Administrator",
    });

    return NextResponse.json({
      message: "Super Admin initialized successfully",
      credentials: {
        email: "nk10nikhil@gmail.com",
        password: "nk10nikhil",
      },
    });
  } catch (error) {
    console.error("Initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize Super Admin" },
      { status: 500 },
    );
  }
}
