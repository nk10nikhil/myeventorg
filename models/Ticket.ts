import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  qrCode: string;
  qrId: string;
  paymentId: string;
  paymentStatus: "pending" | "completed" | "failed";
  amount: number;
  scanStatus: "unused" | "used";
  scannedAt?: Date;
  scannedBy?: mongoose.Types.ObjectId;
  scannedAtGate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    qrCode: { type: String, required: true },
    qrId: { type: String, required: true, unique: true },
    paymentId: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    amount: { type: Number, required: true },
    scanStatus: {
      type: String,
      enum: ["unused", "used"],
      default: "unused",
    },
    scannedAt: { type: Date },
    scannedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    scannedAtGate: { type: String },
  },
  { timestamps: true },
);

TicketSchema.index({ qrId: 1 });
TicketSchema.index({ userId: 1, eventId: 1 });

export default mongoose.models.Ticket ||
  mongoose.model<ITicket>("Ticket", TicketSchema);
