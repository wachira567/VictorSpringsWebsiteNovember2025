import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/neon";
import { AdminModel } from "@/models/AdminSQL";

export async function GET() {
  try {
    const admins = await AdminModel.find({}, { sort: { createdAt: -1 } });

    return NextResponse.json(admins);
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
    const body = await request.json();
    const { email, password, isSuperAdmin, createdBy } = body;

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    const admin = await AdminModel.create({
      email,
      password,
      isSuperAdmin: isSuperAdmin || false,
      createdBy,
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
