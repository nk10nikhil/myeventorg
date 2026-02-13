import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SuperAdmin from "@/models/SuperAdmin";
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

    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValidPassword = await comparePassword(
      password,
      superAdmin.password,
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = generateToken({
      id: superAdmin._id.toString(),
      email: superAdmin.email,
      role: "superadmin",
    });

    const response = NextResponse.json({
      message: "Login successful",
      superAdmin: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
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
    console.error("Super admin login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
