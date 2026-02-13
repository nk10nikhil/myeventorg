import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import OTP from "@/models/OTP";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { tempToken, otp } = await request.json();

    if (!tempToken || !otp) {
      return NextResponse.json(
        { error: "Token and OTP are required" },
        { status: 400 },
      );
    }

    // Decode email from temp token
    const email = Buffer.from(tempToken, "base64").toString("utf-8");

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 },
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json({ error: "OTP expired" }, { status: 401 });
    }

    // Get admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate token
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
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
