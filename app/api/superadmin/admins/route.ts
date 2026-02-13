import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { getUserFromRequest } from "@/lib/middleware";
import { hashPassword } from "@/lib/auth";
import {
  isValidEmail,
  sanitizeString,
  isValidPassword,
  isValidObjectId,
} from "@/lib/validation";

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

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = email.toLowerCase().trim();

    // Validate email
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors[0] },
        { status: 400 },
      );
    }

    // Validate eventIds if provided
    if (eventIds && eventIds.length > 0) {
      if (!Array.isArray(eventIds) || !eventIds.every(isValidObjectId)) {
        return NextResponse.json(
          { error: "Invalid event IDs" },
          { status: 400 },
        );
      }
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: sanitizedEmail });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = await Admin.create({
      name: sanitizedName,
      email: sanitizedEmail,
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
