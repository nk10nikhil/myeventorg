import mongoose, { Schema, type Document } from "mongoose"

export interface IAdmin extends Document {
  name: string
  email: string
  passwordHash: string
  role: "admin" | "superadmin"
  createdAt: Date
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema)
