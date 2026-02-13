import mongoose, { Schema, Document } from "mongoose";

export interface ISuperAdmin extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const SuperAdminSchema = new Schema<ISuperAdmin>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.SuperAdmin ||
  mongoose.model<ISuperAdmin>("SuperAdmin", SuperAdminSchema);
