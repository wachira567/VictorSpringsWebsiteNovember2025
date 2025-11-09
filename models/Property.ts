import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    county: string;
    googlePin: {
      lat: number;
      lng: number;
      placeId: string;
    };
  };
  propertyType: "apartment" | "house" | "villa" | "studio" | "penthouse";
  bedrooms: number;
  bathrooms: number;
  area: number; // in square meters
  amenities: string[];
  images: string[]; // Cloudinary URLs
  featured: boolean;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      county: { type: String, required: true },
      googlePin: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        placeId: { type: String, required: true },
      },
    },
    propertyType: {
      type: String,
      enum: ["apartment", "house", "villa", "studio", "penthouse"],
      required: true,
    },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Add indexes for performance
PropertySchema.index({ "location.city": 1 });
PropertySchema.index({ "location.county": 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ featured: 1 });
PropertySchema.index({ available: 1 });

export default mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);
