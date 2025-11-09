import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string; // hashed
  isSuperAdmin: boolean;
  createdBy: mongoose.Types.ObjectId; // Only super admin can create admins
  createdAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSuperAdmin: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: false },
  },
  {
    timestamps: true,
  }
);

// Add indexes
AdminSchema.index({ email: 1 });
AdminSchema.index({ isSuperAdmin: 1 });

export default mongoose.models.Admin ||
  mongoose.model<IAdmin>("Admin", AdminSchema);
