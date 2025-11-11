import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/neon";
import { AdminModel } from "@/models/AdminSQL";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, password, isSuperAdmin, createdBy } = body;

    const admin = await AdminModel.findByIdAndUpdate(parseInt(id), {
      email,
      password,
      isSuperAdmin,
      createdBy,
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Prevent deleting the main admin
    const admin = await AdminModel.findById(parseInt(id));
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    if (admin.email === "wachiramboche2@gmail.com") {
      return NextResponse.json(
        { error: "Cannot delete the main administrator" },
        { status: 400 }
      );
    }

    const deleted = await AdminModel.findByIdAndDelete(parseInt(id));

    if (deleted) {
      return NextResponse.json({ message: "Admin deleted successfully" });
    } else {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}
