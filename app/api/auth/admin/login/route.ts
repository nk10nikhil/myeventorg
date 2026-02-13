import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { comparePassword, generateToken } from "@/lib/auth";
import { isValidEmail, checkRateLimit } from "@/lib/validation";

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

    // Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = checkRateLimit(
      `admin-login:${clientIp}:${email}`,
      5,
      15 * 60 * 1000,
    );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes" },
        { status: 429 },
      );
    }

    // Validate email
    const sanitizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const admin = await Admin.findOne({ email: sanitizedEmail });

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
      eventIds: admin.eventIds.map((id: any) => id.toString()),
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
