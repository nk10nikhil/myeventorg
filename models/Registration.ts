import mongoose, { Schema, type Document } from "mongoose"

export interface IRegistration extends Document {
  name: string
  email: string
  phone: string
  paymentId?: string
  orderId: string
  amount: number
  paymentVerified: boolean
  qrCode?: string
  qrUsed: boolean
  createdAt: Date
}

const RegistrationSchema = new Schema<IRegistration>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  paymentId: { type: String },
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentVerified: { type: Boolean, default: false },
  qrCode: { type: String },
  qrUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema)
