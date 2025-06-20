"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_LIMIT = 400 * 60 * 1000; // 240 minutes
const MODAL_TIMEOUT = 30 * 1000; // 30 seconds

const AutoLogout = () => {
  const timeoutRef = useRef(null); // Inactivity timer
  const modalTimerRef = useRef(null); // 30s countdown
  const [showModal, setShowModal] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const hasLoggedOutRef = useRef(false); // Prevent modal after logout

  // 🕒 Start inactivity timer
  const startInactivityTimer = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!videoPlaying && !hasLoggedOutRef.current) {
        setShowModal(true);
      } else {
        startInactivityTimer(); // Retry if video is playing
      }
    }, INACTIVITY_LIMIT - MODAL_TIMEOUT);
  }, [videoPlaying]);

  // 📢 Listen for user activity
  useEffect(() => {
    const handleUserActivity = () => {
      if (!showModal && !hasLoggedOutRef.current) {
        startInactivityTimer();
      }
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );

    startInactivityTimer();

    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(modalTimerRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
    };
  }, [showModal, startInactivityTimer]);

  // 🧠 Modal countdown
  useEffect(() => {
    if (showModal && !videoPlaying) {
      modalTimerRef.current = setTimeout(() => {
        if (!hasLoggedOutRef.current) {
          hasLoggedOutRef.current = true;
          setShowModal(false);
          signOut();
        }
      }, MODAL_TIMEOUT);
    } else {
      clearTimeout(modalTimerRef.current);
    }
  }, [showModal, videoPlaying]);

  // 📺 Track video playing state
  useEffect(() => {
    const checkVideos = () => {
      const videos = document.querySelectorAll("video");
      const playing = Array.from(videos).some(
        (video) => !video.paused && !video.ended && video.readyState > 2
      );
      setVideoPlaying(playing);
    };

    const observer = new MutationObserver(checkVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    const interval = setInterval(checkVideos, 1000);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // ✅ Modal actions
  const handleStayLoggedIn = () => {
    setShowModal(false);
    clearTimeout(modalTimerRef.current);
    if (!hasLoggedOutRef.current) {
      startInactivityTimer();
    }
  };

  const handleLogOut = () => {
    setShowModal(false);
    clearTimeout(modalTimerRef.current);
    hasLoggedOutRef.current = true;
    signOut();
  };

  return (
    <>
      {showModal && !hasLoggedOutRef.current && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
            <h2 className="text-xl font-semibold mb-4">
              Inactivity Logout Warning
            </h2>
            <p className="text-gray-600 mb-4">
              You’ve been inactive. Do you want to stay logged in?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              You’ll be logged out automatically in 30 seconds.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleStayLoggedIn}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
                ✅ Remain Logged-in
              </button>
              <button
                onClick={handleLogOut}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                ❌ Log-out Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoLogout;
