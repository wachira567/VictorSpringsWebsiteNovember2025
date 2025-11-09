import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Try to find property in database first
    let property = null;
    try {
      property = await Property.findById(id);
    } catch (error) {
      // If it's an ObjectId error, skip database lookup and use mock data
      console.log("Database lookup failed, using mock data");
    }

    if (!property) {
      // Return mock data for demo purposes
      const mockProperties: Record<string, any> = {
        "1": {
          _id: "1",
          title: "Modern 2BR Apartment in Westlands",
          description:
            "Beautiful modern apartment in the heart of Westlands with stunning city views. Fully furnished with all amenities included.",
          price: 85000,
          location: {
            address: "Westlands Road",
            city: "Nairobi",
            county: "Nairobi",
          },
          propertyType: "apartment",
          bedrooms: 2,
          bathrooms: 2,
          area: 120,
          amenities: ["WiFi", "Parking", "Security", "Gym"],
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg",
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687079/pexels-fotoaibe-1743227_ml4efp.jpg",
          ],
          featured: true,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "2": {
          _id: "2",
          title: "Luxury Villa in Karen",
          description:
            "Spacious luxury villa in the prestigious Karen area. Perfect for families with large garden and modern amenities.",
          price: 250000,
          location: {
            address: "Karen Road",
            city: "Nairobi",
            county: "Nairobi",
          },
          propertyType: "villa",
          bedrooms: 4,
          bathrooms: 3,
          area: 350,
          amenities: ["WiFi", "Parking", "Security", "Garden", "Swimming Pool"],
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687079/pexels-fotoaibe-1743227_ml4efp.jpg",
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687017/pexels-expect-best-79873-323705_jel5c4.jpg",
          ],
          featured: true,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "3": {
          _id: "3",
          title: "Cozy Studio in Kilimani",
          description:
            "Perfect starter home in the vibrant Kilimani neighborhood. Close to shopping centers and public transport.",
          price: 35000,
          location: {
            address: "Kilimani Road",
            city: "Nairobi",
            county: "Nairobi",
          },
          propertyType: "studio",
          bedrooms: 1,
          bathrooms: 1,
          area: 45,
          amenities: ["WiFi", "Security"],
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687017/pexels-expect-best-79873-323705_jel5c4.jpg",
          ],
          featured: false,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "4": {
          _id: "4",
          title: "Spacious 3BR House in Kileleshwa",
          description:
            "Beautiful family home in the upscale Kileleshwa neighborhood. Modern design with traditional Kenyan architecture elements.",
          price: 120000,
          location: {
            address: "Kileleshwa Road",
            city: "Nairobi",
            county: "Nairobi",
          },
          propertyType: "house",
          bedrooms: 3,
          bathrooms: 2,
          area: 200,
          amenities: ["WiFi", "Parking", "Security", "Garden"],
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg",
          ],
          featured: false,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "5": {
          _id: "5",
          title: "Penthouse with City Views",
          description:
            "Luxurious penthouse apartment with panoramic city views. Premium finishes and top-tier amenities throughout.",
          price: 300000,
          location: {
            address: "Parklands Avenue",
            city: "Nairobi",
            county: "Nairobi",
          },
          propertyType: "penthouse",
          bedrooms: 3,
          bathrooms: 3,
          area: 280,
          amenities: ["WiFi", "Parking", "Security", "Gym", "Concierge"],
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687079/pexels-fotoaibe-1743227_ml4efp.jpg",
          ],
          featured: true,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        "6": {
          _id: "6",
          title: "Affordable 1BR in Eastlands",
          description:
            "Budget-friendly apartment in Eastlands. Perfect for young professionals looking for affordability without compromising on quality.",
          price: 25000,
          location: {
            address: "Eastlands Road",
            city: "Nairobi",
            county: "Nairobi",
          },
          propertyType: "apartment",
          bedrooms: 1,
          bathrooms: 1,
          area: 60,
          amenities: ["WiFi", "Security"],
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687017/pexels-expect-best-79873-323705_jel5c4.jpg",
          ],
          featured: false,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      const mockProperty = mockProperties[id];
      if (mockProperty) {
        return NextResponse.json(mockProperty);
      }

      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      price,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      featured,
      available,
    } = body;

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        location,
        propertyType,
        bedrooms,
        bathrooms,
        area,
        amenities,
        images,
        featured,
        available,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
