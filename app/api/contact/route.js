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
      from: `Contact Form <${process.env.RESEND_FROM}>`, // more friendly format
      to: process.env.RESEND_TO,
      reply_to: email,
      subject: `New Contact Message from ${fullname}`,
      html: `
      <h2>LWJ Contact</h2>
      <p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
      <hr />
      <small>Sent from lwjformedia.com contact form</small>
    `,
      text: `
LWJ Contact Form

Name: ${fullname}
Email: ${email}

Message:
${message}

Sent via lwjformedia.com contact form
    `,
      headers: {
        "List-Unsubscribe": "<mailto:unsubscribe@ljoformedia.com>",
      },
    });

    return NextResponse.json({
      msg: ["Message sent successfully."],
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      msg: ["Unable to send message."],
      success: false,
    });
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
