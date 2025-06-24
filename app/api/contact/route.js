import connectDB from "@/lib/mongodbmongoose";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { fullname, email, message } = await req.json();

  try {
    await connectDB();
    await Contact.create({ fullname, email, message });

    // Send notification email to you
    await resend.emails.send({
      from: "LWJ Form <noreply@ljoformedia.com>",
      to: process.env.RESEND_TO,
      reply_to: userEmail,
      subject: `📬 New message from ${fullname}`,
      headers: {
        "List-Unsubscribe": "<mailto:unsubscribe@ljoformedia.com>",
      },
      text: `
Name: ${fullname}
Email: ${userEmail}

Message:
${message}
  `.trim(),
      html: `
<div style="font-family: sans-serif; line-height:1.5">
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${fullname}</p>
  <p><strong>Email:</strong> ${userEmail}</p>
  <p><strong>Message:</strong></p>
  <p>${message.replace(/\n/g, "<br/>")}</p>
</div>`,
    });

    return NextResponse.json({
      msg: ["Message sent successfully"],
      success: true,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      let errorList = [];
      for (let e in error.errors) {
        errorList.push(error.errors[e].message);
      }
      return NextResponse.json({ msg: errorList });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json({ msg: ["Unable to send message."] });
    }
  }
}

// GET method to retrieve all contact messages
export async function GET() {
  try {
    await connectDB();
    const messages = await Contact.find().sort({ createdAt: -1 }); // Sorted by most recent

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    return NextResponse.json({ msg: ["Unable to fetch messages."] });
  }
}
