import crypto from "crypto"
import Razorpay from "razorpay"

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export async function createRazorpayOrder(amount: number) {
  try {
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    throw new Error("Failed to create payment order")
  }
}

export function verifyRazorpayPayment({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string
  paymentId: string
  signature: string
}) {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex")

  return generatedSignature === signature
}
