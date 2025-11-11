import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/neon";
import { AdminModel } from "@/models/AdminSQL";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (you'll need to implement this check)
    // For now, we'll assume only authenticated users can access

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const admins = await AdminModel.find(
      {},
      {
        sort: { createdAt: -1 },
        skip,
        limit,
      }
    );

    const total = await AdminModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      admins,
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
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin/super admin (implement this check)
    // For now, we'll allow authenticated users

    const body = await request.json();
    const { email, password, isSuperAdmin } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await AdminModel.create({
      email,
      password: hashedPassword,
      isSuperAdmin: isSuperAdmin || false,
      createdBy: parseInt(userId), // Use Clerk userId
    });

    // Return admin without password
    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json(
      {
        admin: adminWithoutPassword,
        message: "Admin created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
