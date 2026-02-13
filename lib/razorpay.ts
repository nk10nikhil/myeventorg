import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export const createRazorpayOrder = async (
  amount: number,
  receiptId: string,
) => {
  try {
    // Check if keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        "Razorpay keys not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env",
      );
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: receiptId,
    });
    return order;
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    throw new Error(
      error.error?.description ||
        error.message ||
        "Failed to create Razorpay order",
    );
  }
};

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string,
): boolean => {
  try {
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex");

    return generated_signature === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

export default razorpay;
