import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import Property from "@/models/Property";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    // Status filter
    const status = searchParams.get("status");
    if (status) {
      filter.status = status;
    }

    // Property ID filter
    const propertyId = searchParams.get("propertyId");
    if (propertyId) {
      filter.propertyId = propertyId;
    }

    // Email filter
    const email = searchParams.get("email");
    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }

    // Phone filter
    const phone = searchParams.get("phone");
    if (phone) {
      filter.phone = { $regex: phone, $options: "i" };
    }

    // Verification status
    const isVerified = searchParams.get("isVerified");
    if (isVerified !== null) {
      filter.isVerified = isVerified === "true";
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Execute query with property population
    const inquiries = await Inquiry.find(filter)
      .populate("propertyId", "title location price")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Inquiry.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      inquiries,
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
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["propertyId", "name", "email", "phone", "message"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate property exists
    const property = await Property.findById(body.propertyId);
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      ...body,
      status: "pending",
      isVerified: false, // Will be updated after OTP verification
      createdAt: new Date(),
    });

    // TODO: Send OTP verification to phone/email
    // For now, we'll mark as verified for demo purposes
    await Inquiry.findByIdAndUpdate(inquiry._id, { isVerified: true });

    return NextResponse.json(
      {
        inquiry,
        message: "Inquiry submitted successfully. We will contact you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    // Update inquiry
    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("propertyId", "title location price");

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
