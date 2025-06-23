"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // ⬅️ Import session

export default function ContactForm() {
  const { data: session } = useSession(); // ⬅️ Grab session
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFullname(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Full name: ", fullname);
    console.log("Email: ", email);
    console.log("Message: ", message);

    const res = await fetch("api/contact", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        fullname,
        email,
        message,
      }),
    });

    const { msg, success } = await res.json();
    setError(msg);
    setSuccess(success);

    if (success) {
      setFullname("");
      setEmail("");
      setMessage("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="py-4 mt-4 border-t flex flex-col gap-5"
      >
        <div>
          <label htmlFor="fullname">Full Name</label>
          <input
            onChange={(e) => setFullname(e.target.value)}
            value={fullname}
            type="text"
            id="fullname"
            placeholder="John Doe"
            className="bg-white"
            readOnly={!!session?.user?.name} // optional: prevent editing
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            id="email"
            placeholder="john@gmail.com"
            className="bg-white"
            readOnly={!!session?.user?.email} // optional: prevent editing
          />
        </div>

        <div>
          <label htmlFor="message">Your Message</label>
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="h-32"
            id="message"
            placeholder="Type your message here..."
          ></textarea>
        </div>

        <button
          className="bg-green-700 p-3 text-white font-bold rounded-md"
          type="submit"
        >
          Send
        </button>
      </form>

      <div className="bg-slate-100 flex flex-col rounded-md">
        {error &&
          error.map((e, index) => (
            <div
              key={index} // Adding a unique key
              className={`${
                success ? "text-green-800" : "text-red-600"
              } px-5 py-2`}
            >
              {e}
            </div>
          ))}
      </div>
    </>
  );
}
