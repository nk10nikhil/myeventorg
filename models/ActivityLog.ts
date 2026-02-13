import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  adminId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  action: string;
  targetType: "user" | "ticket" | "event" | "admin";
  targetId: mongoose.Types.ObjectId;
  details: string;
  timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    action: { type: String, required: true },
    targetType: {
      type: String,
      enum: ["user", "ticket", "event", "admin"],
      required: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true },
    details: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

ActivityLogSchema.index({ eventId: 1, timestamp: -1 });

export default mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
