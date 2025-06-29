// app/api/contact/[id]/route.js
import connectDB from "@/lib/mongodbmongoose";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  // ✅ This is valid, no need to await `params`
  const { id } = params;

  try {
    await connectDB();
    const { done } = await req.json();

    const updated = await Contact.findByIdAndUpdate(
      id,
      { done },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { msg: ["Message not found."], success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      msg: ["Message updated."],
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { msg: ["Update failed."], success: false },
      { status: 500 }
    );
  }
}
