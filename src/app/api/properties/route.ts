import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    // Location filter
    const location = searchParams.get("location");
    if (location) {
      filter.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.address": { $regex: location, $options: "i" } },
        { "location.county": { $regex: location, $options: "i" } },
      ];
    }

    // Property type filter
    const propertyType = searchParams.get("propertyType");
    if (propertyType) {
      filter.propertyType = propertyType;
    }

    // Price range filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Bedrooms filter
    const bedrooms = searchParams.get("bedrooms");
    if (bedrooms) {
      filter.bedrooms = { $gte: parseInt(bedrooms) };
    }

    // Bathrooms filter
    const bathrooms = searchParams.get("bathrooms");
    if (bathrooms) {
      filter.bathrooms = { $gte: parseInt(bathrooms) };
    }

    // Area filter
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = parseInt(minArea);
      if (maxArea) filter.area.$lte = parseInt(maxArea);
    }

    // Amenities filter
    const amenities = searchParams.get("amenities");
    if (amenities) {
      const amenitiesArray = amenities.split(",");
      filter.amenities = { $in: amenitiesArray };
    }

    // Availability filter
    const available = searchParams.get("available");
    if (available === "true") {
      filter.available = true;
    }

    // Featured filter
    const featured = searchParams.get("featured");
    if (featured === "true") {
      filter.featured = true;
    }

    // Exclude specific property (for similar properties)
    const exclude = searchParams.get("exclude");
    if (exclude) {
      filter._id = { $ne: exclude };
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Execute query
    const properties = await Property.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Property.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // If no properties in database, return mock data
    if (properties.length === 0) {
      const mockProperties = [
        {
          _id: "1",
          title: "Modern 2BR Apartment in Westlands",
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
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg",
          ],
          featured: true,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "2",
          title: "Luxury Villa in Karen",
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
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687079/pexels-fotoaibe-1743227_ml4efp.jpg",
          ],
          featured: true,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "3",
          title: "Cozy Studio in Kilimani",
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
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687017/pexels-expect-best-79873-323705_jel5c4.jpg",
          ],
          featured: false,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "4",
          title: "Spacious 3BR House in Kileleshwa",
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
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687078/pexels-fotoaibe-1571459_rsso5r.jpg",
          ],
          featured: false,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "5",
          title: "Penthouse with City Views",
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
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687079/pexels-fotoaibe-1743227_ml4efp.jpg",
          ],
          featured: true,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "6",
          title: "Affordable 1BR in Eastlands",
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
          images: [
            "https://res.cloudinary.com/dtbe44muv/image/upload/v1762687017/pexels-expect-best-79873-323705_jel5c4.jpg",
          ],
          featured: false,
          available: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Apply filters to mock data
      let filteredMock = [...mockProperties];

      if (location) {
        filteredMock = filteredMock.filter(
          (p) =>
            p.location.city.toLowerCase().includes(location.toLowerCase()) ||
            p.location.address.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (propertyType) {
        filteredMock = filteredMock.filter(
          (p) => p.propertyType === propertyType
        );
      }

      if (exclude) {
        filteredMock = filteredMock.filter((p) => p._id !== exclude);
      }

      // Apply limit
      const startIndex = skip;
      const endIndex = startIndex + limit;
      const paginatedMock = filteredMock.slice(startIndex, endIndex);

      return NextResponse.json({
        properties: paginatedMock,
        pagination: {
          page,
          limit,
          total: filteredMock.length,
          totalPages: Math.ceil(filteredMock.length / limit),
          hasNext: endIndex < filteredMock.length,
          hasPrev: page > 1,
        },
      });
    }

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "price",
      "location",
      "propertyType",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create property
    const property = await Property.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
