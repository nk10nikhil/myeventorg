import mongoose, { Schema, Document } from "mongoose";

export interface IEntry extends Document {
  ticketId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  entryTime: Date;
  gateName: string;
  scannedBy: mongoose.Types.ObjectId;
  scannedOffline: boolean;
  syncedAt?: Date;
  deviceInfo?: string;
  createdAt: Date;
}

const EntrySchema = new Schema<IEntry>(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    entryTime: { type: Date, default: Date.now },
    gateName: { type: String, required: true },
    scannedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    scannedOffline: { type: Boolean, default: false },
    syncedAt: { type: Date },
    deviceInfo: { type: String },
  },
  { timestamps: true },
);

EntrySchema.index({ eventId: 1, entryTime: -1 });

export default mongoose.models.Entry ||
  mongoose.model<IEntry>("Entry", EntrySchema);
