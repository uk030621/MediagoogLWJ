import "./globals.css";
import { AuthProvider } from "./providers";
import Navbar from "@/components/Navbar";
import AutoLogout from "./autologout/page"; // Import auto-logout component

export const metadata = {
  title: "Media Library",
  description: "Developed by LWJ",
  icons: {
    icon: "/icons/icon-512x512.png", // Favicon
    apple: "/icons/icon-180x180.png", // Apple touch icon for iOS home screen
  },
  manifest: "/manifest.json", // Link to your Web App Manifest
};

export const viewport = {
  themeColor: "#000000", // Set theme color for browsers and devices here
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <AutoLogout /> {/* Auto-logout added here */}
          {children}
          <footer>
            <p>
              © {new Date().getFullYear()} LWJ Media Library. All rights
              reserved.
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
