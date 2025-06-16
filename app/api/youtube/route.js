import { NextResponse } from "next/server";
import axios from "axios";
import he from "he"; // Import he to decode HTML entities

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q"); // Search query
  const maxResults = searchParams.get("maxResults"); // Max results from the client

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  // Ensure maxResults is a valid number between 5 and 50 (defaults to 10)
  const maxResultsValue = Math.min(Math.max(Number(maxResults) || 10, 5), 50);

  const apiKey = process.env.YOUTUBE_API_KEY; // Your server-side API key

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: maxResultsValue,
          q: query,
          type: "video",
          key: apiKey,
        },
      }
    );

    // Decode HTML entities in titles and descriptions
    const decodedItems = response.data.items.map((item) => ({
      ...item,
      snippet: {
        ...item.snippet,
        title: he.decode(item.snippet.title), // Decode title
        description: he.decode(item.snippet.description), // Decode description
      },
    }));

    return NextResponse.json({ ...response.data, items: decodedItems }); // Send the decoded data
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return NextResponse.json(
      { error: "Error fetching YouTube data" },
      { status: 500 }
    );
  }
}
