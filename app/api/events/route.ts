import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { getUserFromRequest } from "@/lib/middleware";
import {
  sanitizeString,
  isValidEventDates,
  isValidAmount,
} from "@/lib/validation";

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
    const user = getUserFromRequest(request);

    if (!user || user.role !== "superadmin") {
      return NextResponse.json(
        { error: "Only super admin can create events" },
        { status: 403 },
      );
    }

    await connectDB();

    const eventData = await request.json();

    // Validate required fields
    const {
      name,
      description,
      startDate,
      endDate,
      venue,
      ticketPrice,
      maxCapacity,
      qrValidityStart,
      qrValidityEnd,
    } = eventData;

    if (!name || !description || !startDate || !endDate || !venue) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 },
      );
    }

    // Sanitize string inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedDescription = sanitizeString(description);
    const sanitizedVenue = sanitizeString(venue);

    // Validate dates
    if (!isValidEventDates(new Date(startDate), new Date(endDate))) {
      return NextResponse.json(
        { error: "Invalid event dates. End date must be after start date" },
        { status: 400 },
      );
    }

    // Validate ticket price
    if (ticketPrice !== undefined && !isValidAmount(ticketPrice)) {
      return NextResponse.json(
        { error: "Invalid ticket price" },
        { status: 400 },
      );
    }

    // Validate max capacity
    if (
      maxCapacity !== undefined &&
      (maxCapacity <= 0 || !Number.isInteger(maxCapacity))
    ) {
      return NextResponse.json(
        { error: "Invalid max capacity. Must be a positive integer" },
        { status: 400 },
      );
    }

    // Validate QR validity dates if provided
    if (qrValidityStart && qrValidityEnd) {
      if (
        !isValidEventDates(new Date(qrValidityStart), new Date(qrValidityEnd))
      ) {
        return NextResponse.json(
          { error: "Invalid QR validity dates" },
          { status: 400 },
        );
      }
    }

    const event = await Event.create({
      name: sanitizedName,
      description: sanitizedDescription,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      venue: sanitizedVenue,
      ticketPrice: ticketPrice || 0,
      maxCapacity: maxCapacity || 1000,
      isActive: eventData.isActive !== undefined ? eventData.isActive : true,
      qrValidityStart: qrValidityStart ? new Date(qrValidityStart) : undefined,
      qrValidityEnd: qrValidityEnd ? new Date(qrValidityEnd) : undefined,
    });

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
