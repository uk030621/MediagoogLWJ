//app/api/urlhtml/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Ensure the path matches your setup
import { connectMongoDB } from "@/lib/mongodb";
import HtmlUrl from "@/models/htmlurl"; // Correct model name based on your provided schema

export async function GET(req) {
  try {
    await connectMongoDB(); // Ensure MongoDB connection

    // Extract userId from request URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch saved URLs for the user
    const urls = await HtmlUrl.find({ userId }).lean();

    return new Response(JSON.stringify({ urls }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    await connectMongoDB(); // Ensure DB connection

    const { url, title, userId } = await req.json();
    if (!url || !title) {
      return new Response("URL and title are required", { status: 400 });
    }

    const newUrl = await HtmlUrl.create({ url, title, userId }); // Create a new URL entry
    //console.log("Added URL:", newUrl); // Debug

    return new Response(
      JSON.stringify({ message: "URL added successfully", url: newUrl }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in POST route:", error); // Debug
    return new Response(JSON.stringify({ error: "Failed to add URL" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req) {
  try {
    await connectMongoDB(); // Ensure DB connection

    const { id } = await req.json();
    if (!id) {
      return new Response("ID is required", { status: 400 });
    }

    const deletedUrl = await HtmlUrl.findByIdAndDelete(id); // Use Mongoose to delete by ID
    if (!deletedUrl) {
      return new Response(JSON.stringify({ error: "URL not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    //console.log("Deleted URL:", deletedUrl); // Debug
    return new Response(
      JSON.stringify({ message: "URL deleted successfully", url: deletedUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in DELETE route:", error); // Debug
    return new Response(JSON.stringify({ error: "Failed to delete URL" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
