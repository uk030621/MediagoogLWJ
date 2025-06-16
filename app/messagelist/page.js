"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // For redirection

export default function MessageList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]); // Original messages
  const [filteredMessages, setFilteredMessages] = useState([]); // Filtered list
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [hiddenMessages, setHiddenMessages] = useState([]); // Hidden message IDs
  const [loading, setLoading] = useState(true);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL; // Access the environment variable

  // Check user authentication and authorization
  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (!session || session.user.email !== adminEmail) {
      // Redirect unauthorized users
      router.push("/");
    }
  }, [session, status, router, adminEmail]);

  useEffect(() => {
    if (session && session.user.email === adminEmail) {
      const fetchMessages = async () => {
        try {
          const res = await fetch("/api/contact");
          let data = await res.json();

          // Sort messages (most recent first)
          data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

          setMessages(data);
          setFilteredMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [session, adminEmail]);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = messages.filter(
      (message) =>
        message.fullname.toLowerCase().includes(query) ||
        message.email.toLowerCase().includes(query) ||
        message.message.toLowerCase().includes(query)
    );

    setFilteredMessages(filtered);
  };

  // Handle clear search field
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredMessages(messages);
  };

  // Handle "Hide" checkbox
  const handleHide = (id) => {
    setHiddenMessages((prevHidden) => [...prevHidden, id]);
  };

  // Handle "Done" checkbox
  const handleDone = (id) => {
    const updatedMessages = filteredMessages.map((message) =>
      message._id === id
        ? { ...message, done: !message.done } // Toggle 'done' status
        : message
    );
    setFilteredMessages(updatedMessages);
  };

  // Unhide all messages
  const unhideAll = () => {
    setHiddenMessages([]);
  };

  // Loading or unauthorized user handling
  if (status === "loading" || (session && session.user.email !== adminEmail)) {
    return <p className="text-gray-600">Loading...</p>;
  }

  // Render the message list
  return (
    <div className="bg-background">
      <div className="min-h-screen p-5 ">
        <div className="flex gap-4 items-center self-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-5">Messages</h1>
          {/* Unhide All Messages Button */}
          <button
            onClick={unhideAll}
            className="mb-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            Unhide All Messages
          </button>
        </div>

        {/* Search Field */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 border border-gray-300 rounded-md bg-white"
          />
          <button
            onClick={clearSearch}
            className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
          >
            Clear Search
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading messages...</p>
        ) : filteredMessages.length > 0 ? (
          <div className="space-y-4">
            {filteredMessages.map(
              (message) =>
                !hiddenMessages.includes(message._id) ? ( // Exclude hidden messages
                  <div
                    key={message._id}
                    className={`p-4 border border-gray-200 bg-white rounded shadow ${
                      message.done ? "bg-green-100" : ""
                    }`}
                  >
                    <h2 className="text-xl font-semibold text-blue-700">
                      {message.fullname}
                    </h2>
                    <p className="text-gray-500">
                      <strong>Email:</strong>{" "}
                      <a
                        href={`mailto:${message.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {message.email}
                      </a>
                    </p>
                    <p className="text-gray-800 mt-2">{message.message}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      <strong>Sent:</strong>{" "}
                      {new Date(message.date).toLocaleString("en-GB")}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-6 items-center justify-start">
                      <button
                        onClick={() => handleDone(message._id)}
                        className={`px-4 py-2 text-sm rounded ${
                          message.done
                            ? "bg-green-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {message.done ? "Mark as Undone" : "Mark as Done"}
                      </button>
                      <button
                        onClick={() => handleHide(message._id)}
                        className="px-4 py-2 text-sm bg-red-500 text-white rounded"
                      >
                        Hide
                      </button>
                    </div>
                  </div>
                ) : null // Hide the message if it's in hiddenMessages
            )}
          </div>
        ) : (
          <p className="text-gray-600">No messages found.</p>
        )}
      </div>
    </div>
  );
}
