import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";
import User from "@/models/User";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { generateQRId, generateQRCode } from "@/lib/qr";
import { sendTicketEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { orderId, paymentId, signature, userId, eventId, amount } =
      await request.json();

    // Test mode - skip signature verification
    const isTestMode = orderId?.startsWith("test_order_");

    let isValid = true;
    if (!isTestMode) {
      // Verify payment signature for real payments
      isValid = verifyRazorpaySignature(orderId, paymentId, signature);
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
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
      paymentId: isTestMode ? `test_payment_${Date.now()}` : paymentId,
      paymentStatus: "completed",
      amount: amount / 100, // Convert paise to rupees
      scanStatus: "unused",
    });

    // Get user and event details
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (user && event) {
      // Send ticket email
      try {
        await sendTicketEmail(
          user.email,
          user.name,
          event.name,
          qrCode,
          ticket._id.toString(),
        );
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the whole request if email fails
      }
    }

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
