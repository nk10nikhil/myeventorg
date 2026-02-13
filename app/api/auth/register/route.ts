import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword, generateToken } from "@/lib/auth";
import {
  isValidEmail,
  isValidPhone,
  sanitizeString,
  isValidPassword,
  isValidDOB,
  isValidObjectId,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, phone, dateOfBirth, password, eventId } =
      await request.json();

    // Validate inputs
    if (!name || !email || !phone || !dateOfBirth || !password || !eventId) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    // Validate phone
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number. Please enter a valid 10-digit number" },
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

    // Validate date of birth
    if (!isValidDOB(new Date(dateOfBirth))) {
      return NextResponse.json(
        { error: "Invalid date of birth. Must be at least 10 years old" },
        { status: 400 },
      );
    }

    // Validate eventId
    if (!isValidObjectId(eventId)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    // Check if user already exists for this event
    const existingUser = await User.findOne({ email: sanitizedEmail, eventId });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered for this event" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      password: hashedPassword,
      eventId,
    });

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: "user",
      eventId: user.eventId.toString(),
    });

    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          eventId: user.eventId,
        },
      },
      { status: 201 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
