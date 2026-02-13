import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  ticketPrice: number;
  maxCapacity: number;
  isActive: boolean;
  qrValidityStart?: Date;
  qrValidityEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    venue: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    maxCapacity: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    qrValidityStart: { type: Date },
    qrValidityEnd: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>("Event", EventSchema);
