// Next.js 13 API Route for Google Custom Search
//app/api/customsearch/route.js
export async function POST(req) {
  try {
    // Extract the search query from the request body
    const { query } = await req.json();

    // If no query is provided, return a 400 error
    if (!query) {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        { status: 400 }
      );
    }

    // Fetch API Key and CSE ID from environment variables
    const GOOG_API_KEY = process.env.GOOGLE_API_KEY;
    const CSEngine_ID = process.env.CSE_ID;

    // Check if the API key and CSE ID are available
    if (!GOOG_API_KEY || !CSEngine_ID) {
      return new Response(
        JSON.stringify({ error: "API key or CSE ID missing" }),
        { status: 500 }
      );
    }

    // Google Custom Search API URL
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOG_API_KEY}&cx=${CSEngine_ID}&q=${encodeURIComponent(
      query
    )}`;

    // Fetch data from Google Custom Search API
    const response = await fetch(searchUrl);
    const data = await response.json();

    // If no items are returned, handle as a 404 error
    if (!data.items) {
      return new Response(JSON.stringify({ error: "No results found" }), {
        status: 404,
      });
    }

    // Map and return the search results
    const results = data.items.map((item) => ({
      title: item.title,
      url: item.link,
    }));

    // Return the results with a 200 status
    return new Response(JSON.stringify({ results }), { status: 200 });
  } catch (error) {
    // Handle any server-side errors
    console.error("Error fetching search results: ", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch search results" }),
      { status: 500 }
    );
  }
}
