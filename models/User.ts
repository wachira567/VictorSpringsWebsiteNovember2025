import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  savedProperties: mongoose.Types.ObjectId[];
  createdAt: Date;
  isVerified: boolean;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    savedProperties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Add indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
