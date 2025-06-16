"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const hideNavbarPaths = ["/register", "/"];

  if (hideNavbarPaths.includes(pathname)) {
    return null;
  }

  return (
    <header>
      <nav className="navbar">
        <div className="nav-links-container">
          <ul className="nav-links flex justify-center items-center">
            <li>
              <Link href="/" className="text-xs md:text-lg lg:text-xl">
                Home
              </Link>
            </li>
            <li>
              <Link href="/youtube" className="text-xs md:text-lg lg:text-xl">
                YouTube
              </Link>
            </li>
            <li>
              <Link
                href="/customsearch"
                className="text-xs md:text-lg lg:text-xl"
              >
                URL
              </Link>
            </li>
            <li>
              <Link href="/enhanced" className="text-xs md:text-lg lg:text-xl">
                Library
              </Link>
            </li>
            <li>
              <Link
                href="#"
                onClick={async (e) => {
                  e.preventDefault();
                  await signOut({ redirect: false });
                  router.push("/"); // Send user to login
                }}
                className="text-xs md:text-lg lg:text-xl cursor-pointer"
              >
                Exit
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
