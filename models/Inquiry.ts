import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  propertyId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: "whatsapp" | "phone" | "email";
  status: "pending" | "contacted" | "resolved";
  createdAt: Date;
  isVerified: boolean; // phone/email verification status
}

const InquirySchema: Schema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    preferredContact: {
      type: String,
      enum: ["whatsapp", "phone", "email"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "resolved"],
      default: "pending",
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Add indexes
InquirySchema.index({ propertyId: 1 });
InquirySchema.index({ status: 1 });
InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ email: 1 });

export default mongoose.models.Inquiry ||
  mongoose.model<IInquiry>("Inquiry", InquirySchema);
