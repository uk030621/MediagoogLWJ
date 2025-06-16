"use client";

import styles from "@/styles/Home.module.css"; // Import the CSS module
import YouTube from "react-youtube"; // Import the YouTube component
//import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For redirection
import LiveClock from "@/components/LiveClock"; // At the top

export default function HomePage() {
  const videos = [
    /*{ id: "sRxrwjOtIag", title: "Sample Video 1" },*/
    { id: "eUDVUZZyA0M", title: "Ludovico Einaudi - Experience" },
  ];

  const { data: session } = useSession();
  //const [dateTime, setDateTime] = useState(new Date());
  const router = useRouter(); // Initialize router using useRouter
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL; // Access the admin email from env
  const [showDialog, setShowDialog] = useState(false); // Track dialog visibility

  const handleAdminClick = () => {
    if (session?.user.email !== adminEmail) {
      // Show dialog box
      setShowDialog(true);
    } else {
      // Navigate to admin page
      router.push("/messagelist");
    }
  };

  {
    /*useEffect(() => {
    const now = new Date();
    setDateTime(now); // Set initial consistent value
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);*/
  }

  return (
    <div className="background-container bg-background">
      {/* Video Background */}
      {/* Uncomment if needed
      <video autoPlay muted loop playsInline className="background-video">
        <source src="/clouds.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>*/}

      <div className="flex flex-col items-left">
        <div className={styles.homeContainer}>
          <h1 className={styles.gradientText}>
            Welcome{" "}
            <span className="font-bold">
              {session?.user?.name?.split(" ")[0]}
            </span>{" "}
            To Your Media Library
          </h1>

          <div className="flex  flex-col justify-center mr-5">
            {/*<p className="font-thin ml-1 text-sm">{session?.user?.email}</p>*/}
            <div className="flex justify-center gap-2 mb-1">
              <LiveClock />
              {/*{dateTime ? (
                <>
                  <p className="mr-5 text-sm font-thin text-black">
                    {dateTime.toLocaleDateString()}
                  </p>
                  <p className="text-sm font-thin text-black">
                    {dateTime.toLocaleTimeString()} hr
                  </p>
                </>
              ) : (
                <p className="text-sm text-black">Loading time...</p>
              )}*/}
            </div>
          </div>
          <p className={styles.description}>
            Keep your most important media in a personal library for easy
            reference.
          </p>
          {/*<div className="flex justify-center mt-2">
            <div>
              Owner: <span className="font-bold">{session?.user?.name}</span>
              Owner:{" "}
              <span className="font-bold">
                {session?.user?.name?.split(" ")[0]}
              </span>
            </div>
            <div className="ml-4">
              Email: <span className="font-bold">{session?.user?.email}</span>
            </div>
          </div>*/}

          {/* Explanatory Dropdown */}
          <div className="mt-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-fit text-sm bg-slate-900 hover:bg-slate-600 text-white px-2 py-1 rounded text-center"
            >
              {isDropdownOpen ? "Hide Guide ▴" : "User Guide ▾"}
            </button>
            {isDropdownOpen && (
              <div className="mt-2 text-left text-sm bg-gray-50 border rounded-lg p-4">
                {/*<p className="text-gray-800 font-extrabold">
                  Guide for Media Library App
                </p>*/}
                <ul className="list-disc list-inside text-gray-700">
                  <div className="flex gap-4 text-right">
                    <Link
                      className="bg-amber-200 px-4 py-2 text-xs rounded-lg pt-2 text-right "
                      href="\contact"
                    >
                      Contact Developer
                    </Link>
                    {/* Admin Link */}
                    {/* Admin Button */}
                    <button
                      className="bg-amber-200 px-4 py-2 text-xs rounded-lg pt-2 text-right"
                      onClick={handleAdminClick}
                    >
                      Admin 🚫
                    </button>

                    {/* Simple Custom Dialog */}
                    {showDialog && (
                      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-4 rounded shadow-lg text-center ml-2 mr-2">
                          <p className="text-gray-700">
                            Access Denied. You do not have permission to view
                            this page.
                          </p>
                          <button
                            onClick={() => setShowDialog(false)} // Close dialog
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2">
                    <strong>Introduction</strong>
                  </p>
                  <p className="text-sm mb-3">
                    Welcome to the Media Library App. This application allows
                    users to search for YouTube videos or URLs and store them in
                    a personalised, searchable library. A key feature of this
                    app is that stored YouTube videos are{" "}
                    <span className="font-bold">ad-free</span>, enhancing your
                    viewing experience.
                  </p>
                  <p>
                    <strong>Features</strong>
                  </p>
                  <li>
                    Search YouTube Videos or URLs: Enter search criteria to find
                    relevant videos or web pages.
                  </li>
                  <li>
                    Add to Library: Save selected YouTube videos or URLs to your
                    personal media library.
                  </li>
                  <li>
                    Ad-Free Playback: Enjoy stored YouTube videos without
                    advertisements.
                  </li>
                  <li>
                    Manage Library: Easily delete videos or URLs when they are
                    no longer needed.
                  </li>
                  <p className="mt-3">
                    <strong>Getting Started</strong>
                  </p>
                  <li>
                    Search for Content: Use the search bar to find YouTube
                    videos or URLs.
                  </li>
                  <li>
                    Select a Video or URL: Choose the content you want to add
                    from the search results.
                  </li>
                  <li>
                    Add to Library: Click the &apos;Add to Library&apos; button
                    to store the selected content.
                  </li>
                  <li>
                    Access Stored Media: Navigate to your library to view saved
                    content anytime.
                  </li>
                  <li>
                    Remove Unwanted Items: Click the delete icon to remove a
                    video or URL from your library.
                  </li>
                  <p className="mt-3">
                    <strong>Known Limitations</strong>
                  </p>
                  <li>
                    Add to Library or Delete: It is unusual but possible that an
                    add or delete function may fail on first attempt. It is
                    however probable that it will execute properly on a second
                    attempt.
                  </li>
                  <li>
                    YouTube Sign-In Requirement: Occasionally, certain videos
                    may require a YouTube sign-in to play directly within the
                    app.
                  </li>
                  <li>
                    Region-Based Restrictions: Some YouTube videos, especially
                    those based in the USA, may impose advertisements despite
                    being stored in the library. They may also prevent access
                    from other countries and/or regions. Tip: If you have a VPN
                    installed on your device switch server to the source country
                    eg, use a USA server.
                  </li>
                  <p className="mt-3">
                    <strong>
                      The Media Library App provides a streamlined way to
                      collect and watch YouTube videos without interruptions.
                      While minor limitations exist, the overall experience
                      remains ad-free and efficient. Enjoy managing your
                      personal media collection hassle-free!
                    </strong>
                  </p>
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-center items-center">
            <ul className="text-left  mt-4 text-slate-800">
              <li className="text-base font-thin">
                <Link
                  href="/youtube"
                  className="flex items-center gap-2 hover:text-blue-500"
                >
                  ❤️ Add your favourite YouTube videos.
                </Link>
                <div className="border-4 rounded-lg bg-slate-200">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    {videos.map((video, index) => (
                      <div
                        key={index}
                        style={{
                          margin: "0 10px",
                          marginRight: "10px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <YouTube
                          videoId={video.id}
                          opts={{
                            width: "250", // Adjust for responsiveness
                            height: "150",
                            playerVars: {
                              autoplay: 0,
                              modestbranding: 1,
                              rel: 0,
                            },
                          }}
                        />
                        <p
                          style={{
                            marginTop: "5px",
                            fontSize: "12px",
                            color: "gray",
                          }}
                        >
                          {video.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              <li className="mt-8 text-base font-thin">
                <Link
                  href="/customsearch"
                  className="flex items-center gap-2 hover:text-blue-500"
                >
                  ➕ Add URLs for quick reference.
                </Link>
              </li>
              <li className="mt-8 text-base font-thin">
                <Link
                  href="/enhanced"
                  className="flex items-center gap-2 hover:text-blue-500"
                >
                  🔍 Easily search your library.
                </Link>
              </li>
              <li className="mt-8 text-base font-thin">
                <Link
                  href="/enhanced"
                  className="flex items-center gap-2 hover:text-blue-500"
                >
                  {" "}
                  🏠 Centralise your media links.
                </Link>
              </li>

              {/*<li className="mt-6">🏆 Bonus applications included.</li>*/}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
