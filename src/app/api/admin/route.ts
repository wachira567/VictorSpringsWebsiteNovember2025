import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Only super admins can view all admins
    const currentAdmin = await Admin.findOne({ email: session.user.email });
    if (!currentAdmin?.isSuperAdmin) {
      return NextResponse.json(
        { error: "Only super admins can view admin list" },
        { status: 403 }
      );
    }

    const admins = await Admin.find({})
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Admin.countDocuments();
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
    const session = await getServerSession();

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { email, password, isSuperAdmin } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if current user is super admin
    const currentAdmin = await Admin.findOne({ email: session.user.email });
    if (!currentAdmin?.isSuperAdmin) {
      return NextResponse.json(
        { error: "Only super admins can create admin accounts" },
        { status: 403 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      isSuperAdmin: isSuperAdmin || false,
      createdBy: currentAdmin._id,
      createdAt: new Date(),
    });

    // Return admin without password
    const { password: _, ...adminWithoutPassword } = admin.toObject();

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
