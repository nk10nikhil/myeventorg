import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValidPassword = await comparePassword(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: "admin",
    });

    const response = NextResponse.json({
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        eventIds: admin.eventIds,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
