import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import connectDB from "@/lib/db";
import Event from "@/models/Event";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { eventId, userId } = await request.json();

    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const receiptId = `receipt_${userId}_${Date.now()}`;
    const order = await createRazorpayOrder(event.ticketPrice, receiptId);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
