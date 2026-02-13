import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";
import User from "@/models/User";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { generateQRId, generateQRCode } from "@/lib/qr";
import { sendTicketEmail } from "@/lib/email";
import { isValidObjectId, isValidAmount } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { orderId, paymentId, signature, userId, eventId, amount } =
      await request.json();

    console.log("[Payment] Verifying payment:", { orderId, paymentId, userId });

    // Validate inputs
    if (
      !orderId ||
      !paymentId ||
      !signature ||
      !userId ||
      !eventId ||
      !amount
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate IDs
    if (!isValidObjectId(userId) || !isValidObjectId(eventId)) {
      return NextResponse.json(
        { error: "Invalid user or event ID" },
        { status: 400 },
      );
    }

    // Validate amount
    if (!isValidAmount(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Check for duplicate payment processing
    const existingTicket = await Ticket.findOne({ paymentId });
    if (existingTicket) {
      console.log("[Payment] Duplicate payment detected:", paymentId);
      return NextResponse.json(
        {
          message: "Payment already processed",
          ticket: {
            id: existingTicket._id,
            qrCode: existingTicket.qrCode,
            qrId: existingTicket.qrId,
          },
        },
        { status: 200 },
      );
    }

    // Verify payment signature
    const isValid = verifyRazorpaySignature(orderId, paymentId, signature);

    if (!isValid) {
      console.error("[Payment] Invalid signature");
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    console.log("[Payment] Signature verified, generating QR...");

    // Verify user and event exist
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user already has a ticket for this event
    const existingUserTicket = await Ticket.findOne({ userId, eventId });
    if (existingUserTicket) {
      console.log("[Payment] User already has ticket for this event");
      return NextResponse.json(
        {
          message: "You already have a ticket for this event",
          ticket: {
            id: existingUserTicket._id,
            qrCode: existingUserTicket.qrCode,
            qrId: existingUserTicket.qrId,
          },
        },
        { status: 200 },
      );
    }

    // Generate QR code
    const qrId = generateQRId();
    const qrData = JSON.stringify({
      qrId,
      ticketId: `TKT_${Date.now()}`,
      userId,
      eventId,
    });
    const qrCode = await generateQRCode(qrData);

    // Create ticket
    const ticket = await Ticket.create({
      userId,
      eventId,
      qrCode,
      qrId,
      paymentId,
      paymentStatus: "completed",
      amount: amount / 100, // Convert paise to rupees
      scanStatus: "unused",
    });

    console.log("[Payment] Ticket created:", ticket._id);

    // Send ticket email (non-blocking, continue even if fails)
    try {
      await sendTicketEmail(
        user.email,
        user.name,
        event.name,
        qrCode,
        ticket._id.toString(),
      );
      console.log("[Payment] Ticket email sent successfully");
    } catch (emailError) {
      console.error("[Payment] Email sending failed:", emailError);
      // Don't fail the whole request if email fails
    }

    console.log("[Payment] Verification complete");

    return NextResponse.json({
      message: "Payment verified successfully",
      ticket: {
        id: ticket._id,
        qrCode: ticket.qrCode,
        qrId: ticket.qrId,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 },
    );
  }
}
