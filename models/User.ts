import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  password: string;
  eventId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    password: { type: String, required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1, eventId: 1 }, { unique: true });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
