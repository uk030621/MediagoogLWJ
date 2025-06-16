// components/LiveClock.jsx
"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  const [dateTime, setDateTime] = useState(null);

  useEffect(() => {
    const update = () => setDateTime(new Date());
    update(); // Set initial value
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!dateTime) return <p className="text-sm text-black">Loading time...</p>;

  return (
    <div className="flex justify-center gap-2 mb-1">
      <p className="mr-5 text-sm font-thin text-black">
        {dateTime.toLocaleDateString()}
      </p>
      <p className="text-sm font-thin text-black">
        {dateTime.toLocaleTimeString()} hr
      </p>
    </div>
  );
}
