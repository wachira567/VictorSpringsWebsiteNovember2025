import { NextRequest, NextResponse } from "next/server";
import PropertyModel from "@/models/PropertySQL";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Handle random featured properties for homepage
    const random = searchParams.get("random");
    if (random === "true") {
      const featured = searchParams.get("featured");
      if (featured === "true") {
        // Get random featured properties for homepage
        const client = await import("@/lib/neon").then((m) =>
          m.connectToDatabase()
        );

        const query = `
          SELECT id, title, description, price, address, city, county, lat, lng, place_id as "placeId",
                 property_type as "propertyType", bedrooms, bathrooms, area, amenities, images,
                 featured, available, created_at as "createdAt", updated_at as "updatedAt"
          FROM properties
          WHERE featured = true AND available = true
          ORDER BY RANDOM()
          LIMIT $1
        `;

        const result = await client.query(query, [limit]);
        await client.release();

        return NextResponse.json({
          properties: result.rows.map((row: any) => ({
            ...row,
            amenities: row.amenities || [],
            images: row.images || [],
          })),
          pagination: {
            page: 1,
            limit,
            total: result.rows.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        });
      }
    }

    // Build filter object
    const filter: any = {};

    // Location filter - optimized for better search
    const location = searchParams.get("location");
    if (location) {
      filter.city = location; // Single filter that searches across city, county, and address
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
      filter._id = { $ne: parseInt(exclude) };
    }

    // Sorting
    const sortParam = searchParams.get("sort");
    let sort: any = { createdAt: -1 }; // Default sort

    if (sortParam) {
      if (sortParam === "price:asc") {
        sort = { price: 1 };
      } else if (sortParam === "price:desc") {
        sort = { price: -1 };
      } else if (sortParam === "featured") {
        sort = { featured: -1, createdAt: -1 };
      } else if (sortParam === "newest") {
        sort = { createdAt: -1 };
      }
    }

    // Execute query
    const properties = await PropertyModel.find(filter, {
      sort,
      skip,
      limit,
    });

    const total = await PropertyModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

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

    // Transform location data for SQL
    const locationData = {
      address: body.location.address,
      city: body.location.city,
      county: body.location.county,
      lat: body.location.googlePin.lat,
      lng: body.location.googlePin.lng,
      placeId: body.location.googlePin.placeId,
    };

    // Create property
    const property = await PropertyModel.create({
      title: body.title,
      description: body.description,
      price: body.price,
      address: locationData.address,
      city: locationData.city,
      county: locationData.county,
      lat: locationData.lat,
      lng: locationData.lng,
      placeId: locationData.placeId,
      propertyType: body.propertyType,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      area: body.area,
      amenities: body.amenities || [],
      images: body.images || [],
      featured: body.featured || false,
      available: body.available !== false,
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
