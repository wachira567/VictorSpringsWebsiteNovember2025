import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/neon";
import { InquiryModel } from "@/models/InquirySQL";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, name, email, phone, message, propertyId } = body;

    const inquiry = await InquiryModel.findByIdAndUpdate(parseInt(id), {
      status,
      name,
      email,
      phone,
      message,
      propertyId: propertyId ? parseInt(propertyId) : undefined,
    });

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
