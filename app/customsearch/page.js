"use client";

import { useState } from "react";
import { useSession } from "next-auth/react"; // Import useSession for user authentication
import { useRouter } from "next/navigation";

export default function SearchComponent() {
  const { data: session } = useSession(); // Get the logged-in user session
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle search query submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch("/api/customsearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
      } else {
        console.error("Error:", data.error || "Unknown error");
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    }

    setLoading(false);
  };

  // Function to clear/reset search
  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  // Function to add URL to the library
  const handleAddURL = async (url, title) => {
    if (!session?.user?.id) {
      console.error("User not authenticated");
      alert("You must be logged in to add media.");
      return;
    }

    try {
      const postData = {
        url: url,
        title: title,
        userId: session.user.id, // Include userId from session
      };

      //console.log("Sending POST request with data:", postData);

      const response = await fetch("/api/urlhtml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to add URL to the library.");
      }

      //console.log("Successfully added URL:", title);
      window.location.href = "/enhanced"; // Redirect after adding
    } catch (error) {
      console.error("Error adding URL to the library:", error);
      alert("Failed to add URL to the library.");
    }
  };

  // Handle copying the URL, adding it to the library, and redirecting
  const handleCopy = async (url, title) => {
    try {
      await navigator.clipboard.writeText(url);
      alert(`Copied URL: ${url}`);
      await handleAddURL(url, title); // Auto-add after copying
    } catch (err) {
      console.error("Failed to copy and add URL: ", err);
    }
  };

  return (
    <div className="background-container bg-background">
      <div className="flex flex-col items-center p-8 w-full max-w-lg mx-auto ">
        <h1 className="text-2xl font-bold mb-4">URL Search</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded mb-4"
          onClick={() => router.back()}
        >
          ⬅️ Back
        </button>
        <form onSubmit={handleSearch} className="flex flex-col gap-4 w-72">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query"
            required
            className="p-2 text-base border border-gray-300 rounded"
          />
          <div className="flex gap-4 items-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white w-40 rounded ${
                loading ? "bg-gray-500" : "bg-blue-600"
              }`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 bg-black text-white rounded w-40"
            >
              Clear/Reset
            </button>
          </div>
        </form>
        {results.length > 0 && (
          <div className="mt-8 w-full">
            <h3 className="mb-4 text-lg">Search Results:</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-100">Title</th>
                  <th className="border p-2 bg-gray-100">URL</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:underline"
                      >
                        {result.title}
                      </a>
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleCopy(result.url, result.title)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
