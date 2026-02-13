import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { comparePassword, generateToken } from "@/lib/auth";
import {
  isValidEmail,
  isValidObjectId,
  checkRateLimit,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password, eventId } = await request.json();

    if (!email || !password || !eventId) {
      return NextResponse.json(
        { error: "Email, password, and event ID are required" },
        { status: 400 },
      );
    }

    // Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimit = checkRateLimit(
      `login:${clientIp}:${email}`,
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

    // Validate eventId
    if (!isValidObjectId(eventId)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const user = await User.findOne({ email: sanitizedEmail, eventId });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: "user",
      eventId: user.eventId.toString(),
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        eventId: user.eventId,
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
