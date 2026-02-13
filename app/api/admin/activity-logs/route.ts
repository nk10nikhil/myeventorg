import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";
import { getUserFromRequest } from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const query: any = {};
    if (eventId) {
      query.eventId = eventId;
    }

    const logs = await ActivityLog.find(query)
      .populate("adminId", "name email")
      .sort({ timestamp: -1 })
      .limit(limit);

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Fetch activity logs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 },
    );
  }
}
