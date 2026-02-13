import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import connectDB from "@/lib/db";
import Event from "@/models/Event";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { eventId, userId } = await request.json();
    console.log("[Payment] Creating order for:", { eventId, userId });

    const event = await Event.findById(eventId);

    if (!event) {
      console.error("[Payment] Event not found:", eventId);
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    console.log("[Payment] Event found:", {
      name: event.name,
      price: event.ticketPrice,
    });
    console.log("[Payment] Razorpay keys configured:", {
      key_id: process.env.RAZORPAY_KEY_ID ? "Yes" : "No",
      key_secret: process.env.RAZORPAY_KEY_SECRET ? "Yes" : "No",
    });

    // Generate receipt ID (max 40 chars for Razorpay)
    // Format: rcpt_<last10charsOfUserId>_<timestamp>
    const receiptId = `rcpt_${userId.slice(-10)}_${Date.now()}`;
    const order = await createRazorpayOrder(event.ticketPrice, receiptId);

    console.log("[Payment] Order created successfully:", order.id);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("[Payment] Create order error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 },
    );
  }
}
