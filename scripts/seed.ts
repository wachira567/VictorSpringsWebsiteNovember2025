import { connectToDatabase } from "../lib/neon";
import { PropertyModel } from "../models/PropertySQL";
import { UserModel } from "../models/UserSQL";
import { AdminModel } from "../models/AdminSQL";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  try {
    await connectToDatabase();
    console.log("Connected to Neon database");

    // Clear existing data
    await PropertyModel.deleteAll();
    await UserModel.deleteAll();
    await AdminModel.deleteAll();

    // Create super admin
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const superAdmin = await AdminModel.create({
      email: "admin@example.com",
      password: hashedPassword,
      isSuperAdmin: true,
      createdBy: null,
    });
    console.log("Super admin created");

    // Create sample properties
    const sampleProperties = [
      {
        title: "Modern 2BR Apartment in Westlands",
        description:
          "Beautiful modern apartment with stunning city views, fully furnished with high-end appliances.",
        price: 85000,
        address: "Westlands Road, Nairobi",
        city: "Nairobi",
        county: "Nairobi",
        lat: -1.263,
        lng: 36.8065,
        placeId: "ChIJp0lN2HIRLxgRTJKXslQCz_c",
        propertyType: "apartment" as const,
        bedrooms: 2,
        bathrooms: 2,
        area: 120,
        amenities: ["WiFi", "Parking", "Gym", "Swimming Pool", "Security"],
        images: [
          "https://res.cloudinary.com/dtbe44muv/image/upload/v1690000000/sample1.jpg",
        ],
        featured: true,
        available: true,
      },
      {
        title: "Luxury Villa in Karen",
        description:
          "Spacious 4BR villa with private garden, perfect for families seeking tranquility.",
        price: 250000,
        address: "Karen Road, Nairobi",
        city: "Nairobi",
        county: "Nairobi",
        lat: -1.3167,
        lng: 36.6975,
        placeId: "ChIJc6e3soARLxgR8I4F2nK8z_c",
        propertyType: "villa" as const,
        bedrooms: 4,
        bathrooms: 3,
        area: 350,
        amenities: [
          "Garden",
          "Parking",
          "Security",
          "Maid Service",
          "Backup Generator",
        ],
        images: [
          "https://res.cloudinary.com/dtbe44muv/image/upload/v1690000000/sample2.jpg",
        ],
        featured: true,
        available: true,
      },
      {
        title: "Cozy Studio in Kilimani",
        description:
          "Compact and efficient studio apartment, ideal for young professionals.",
        price: 35000,
        address: "Kilimani Road, Nairobi",
        city: "Nairobi",
        county: "Nairobi",
        lat: -1.2917,
        lng: 36.7833,
        placeId: "ChIJd6e3soARLxgR8I4F2nK8z_d",
        propertyType: "studio" as const,
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        amenities: ["WiFi", "Parking", "Security"],
        images: [
          "https://res.cloudinary.com/dtbe44muv/image/upload/v1690000000/sample3.jpg",
        ],
        featured: false,
        available: true,
      },
    ];

    for (const property of sampleProperties) {
      await PropertyModel.create(property);
    }
    console.log("Sample properties created");

    // Create sample user
    const sampleUser = await UserModel.create({
      name: "John Doe",
      email: "john@example.com",
      phone: "+254712345678",
      role: "user",
      savedProperties: [],
      isVerified: true,
    });
    console.log("Sample user created");

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();

export {};
