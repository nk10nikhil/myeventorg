import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { getUserFromRequest } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    // Check if request is from an admin
    const user = getUserFromRequest(request);

    let query: any = activeOnly ? { isActive: true } : {};

    // If admin, filter by their assigned events only
    if (
      user &&
      user.role === "admin" &&
      user.eventIds &&
      user.eventIds.length > 0
    ) {
      query._id = { $in: user.eventIds };
    }

    const events = await Event.find(query).sort({ startDate: -1 });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const eventData = await request.json();

    const event = await Event.create(eventData);

    return NextResponse.json(
      { message: "Event created successfully", event },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
