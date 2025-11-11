import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase(); // Remove db destructuring since we're using mongoose

    const body = await request.json();
    const { status, ...updateData } = body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      params.id,
      {
        ...updateData,
        status,
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
