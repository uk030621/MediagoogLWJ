//app/enhanced/page.js
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import YouTube from "react-youtube";
//import Link from "next/link";
import { useSession } from "next-auth/react";

function decodeHtmlEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

export default function Home() {
  const { data: session } = useSession();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [storedUrls, setStoredUrls] = useState([]);
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const selectedMediaRef = useRef(null);

  const collectionRoute = "/api/urlhtml";

  const fetchUrls = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${collectionRoute}?userId=${session.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch URLs");

      const data = await res.json();

      // Reverse the array once, safely
      const reversed = [...data.urls].reverse();

      setStoredUrls(reversed);
      setFilteredUrls(reversed);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load media. Refreshing...");

      // 🚀 Auto-refresh page after 2 seconds on failure
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  useEffect(() => {
    if (selectedMedia && selectedMediaRef.current) {
      selectedMediaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedMedia]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = storedUrls.filter((media) =>
      decodeHtmlEntities(media.title).toLowerCase().includes(query)
    );
    setFilteredUrls(filtered);
  };

  const getContentType = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (youtubeRegex.test(url) || url.length === 11) return "youtube";
    const extension = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    if (["mp4", "webm", "ogg"].includes(extension)) return "video";
    return "webpage";
  };

  const extractYouTubeId = (url) => {
    if (url.length === 11) return url;
    const match = url.match(
      /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const renderSelectedMedia = (media) => {
    if (!media) return null;

    const contentType = getContentType(media.url);
    switch (contentType) {
      case "image":
        return (
          <Image
            src={media.url}
            alt={media.title}
            width={800}
            height={400}
            className="w-full max-h-[400px] rounded-lg object-contain"
          />
        );
      case "video":
        return (
          <video controls className="w-full max-h-[400px] rounded-lg">
            <source src={media.url} type="video/mp4" />
          </video>
        );
      case "youtube":
        return (
          <YouTube
            videoId={extractYouTubeId(media.url)}
            opts={{
              width: "100%",
              height: "400px",
              playerVars: { autoplay: 0 },
            }}
          />
        );
      default:
        return (
          <a
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white rounded-md p-2 py-3 bg-black mr-3"
          >
            Open Website
          </a>
        );
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(collectionRoute, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete media.");
      fetchUrls();
      if (selectedMedia && selectedMedia._id === id) setSelectedMedia(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete media. Refreshing...");

      // 🚀 **Auto-refresh page after 2 seconds on failure**
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  console.log("Session:", session);

  return (
    <div className="bg-background background-container">
      <div className="w-full mx-auto p-4 ">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-thin">This Media Library</h2>
          <h2 className="text-1xl font-thin">belongs to</h2>
          <h2 className="text-2xl font-semibold mb-4">{session?.user?.name}</h2>
        </div>

        {/*<div className="flex items-center justify-center">
          <Link href="/youtube">
            <button className="bg-black rounded-md text-white mr-3 mb-4 p-2 text-xs">
              🔍 YouTubes
            </button>
          </Link>
          <Link href="/customsearch">
            <button className="bg-black rounded-md text-white mr-3 mb-4 p-2 text-xs">
              🔍 URLs
            </button>
          </Link>
        </div>*/}

        <div className="flex justify-center items-center space-x-3 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by title..."
            className="w-full p-2 border rounded-md"
          />
          <button
            onClick={() => {
              setSearchQuery("");
              handleSearch({ target: { value: "" } });
            }}
            className="bg-gray-700 text-white px-4 h-10 rounded-md"
          >
            Clear
          </button>
        </div>

        {selectedMedia && (
          <div ref={selectedMediaRef} className="mb-6 p-4 border rounded-md">
            <h3 className="text-xl font-semibold mb-4">
              {selectedMedia.title}
            </h3>
            {renderSelectedMedia(selectedMedia)}
            <button
              onClick={() => setSelectedMedia(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Close
            </button>
          </div>
        )}

        {error && <p className="text-gray-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUrls.map((media) => (
              <li
                key={media._id}
                className="p-4 border bg-slate-300 rounded-md"
              >
                <h3 className="text-lg text-black font-thin mb-2">
                  {decodeHtmlEntities(media.title)}
                </h3>
                <button
                  onClick={() => setSelectedMedia(media)}
                  className="text-slate-700 px-4 py-2 rounded-md mr-10 text-xl"
                >
                  📺 <span className="text-xs">View</span>
                </button>
                <button
                  onClick={() => handleDelete(media._id)}
                  className="text-slate-700 px-4 py-2 rounded-md text-xl"
                >
                  🗑️ <span className="text-xs">Delete</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
