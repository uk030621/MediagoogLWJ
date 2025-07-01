"use client";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.push("/mediastart");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid place-items-start justify-center mt-8 h-screen bg-background">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-slate-900">
        <h1 className="text-xl font-bold my-4">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setEmail((e.target.value || "").toLowerCase())}
            type="text"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="bg-slate-900 text-white px-6 py-2 font-bold rounded-md cursor-pointer">
            Login
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <Link className="text-sm  text-right" href={"/register"}>
            Don&apos;t have an account?{" "}
            <span className="underline">Register</span>
          </Link>
          {/*<button
            type="button"
            onClick={() => signIn("google")}
            className="bg-red-600 text-white px-6 py-2 font-bold rounded-md cursor-pointer"
          >
            Sign in with Google
          </button>*/}
          <button
            type="button"
            onClick={() => signIn("google")}
            className="ml-0 text-lg px-4 py-2 bg-blue-700 hover:bg-blue-500 text-white rounded flex items-center justify-center mt-6"
          >
            <Image
              src="/G.png"
              alt="Google logo"
              width={30}
              height={30}
              style={{ width: "auto", height: "auto" }}
              className="rounded-md mr-2"
            />
            Sign In with Google
          </button>
          <p className="mt-2 text-sm text-black text-right">
            Don&apos;t have a Google account?{" "}
            <Link
              href="https://support.google.com/accounts/answer/27441?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              <br />
              <span>Create one here</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
