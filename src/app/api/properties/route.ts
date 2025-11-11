import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(request: NextRequest) {
  try {
    console.log("API: Fetching properties...");
    await connectToDatabase(); // Remove db destructuring since we're using mongoose
    console.log("API: Connected to database");

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

    // If no properties in database, return empty array instead of mock data
    // This ensures we test real DB connection

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
    await connectToDatabase(); // Remove db destructuring since we're using mongoose

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
