"use client";

// File: app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";


// Utility: persist dark mode preference
const DARK_MODE_KEY = "darkMode";


// app/page.tsx (Next.js 13+ with App Router)
export default function Home({ children }:{children:ReactNode}) {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored === "true") setDarkMode(true);
  }, []);

  // Update dark mode and persist preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(DARK_MODE_KEY, darkMode ? "true" : "false");
  }, [darkMode]);

  // Keyboard accessibility for dark mode toggle
  const handleToggleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      setDarkMode((prev) => !prev);
    }
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {/* Skip to content for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50">Skip to main content</a>
        {/* Header */}
        <header className="fixed top-0 w-full bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur z-50" role="banner">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3" aria-label="Main navigation">
            <div className="text-xl font-semibold pr-6">MozWired</div>
            <ul className="hidden md:flex space-x-6 text-sm">
              <li className="relative group">
                <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300" aria-current="page">Home</Link>
                {/* Banner */}
                <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 bg-white dark:bg-gray-900 shadow-lg border rounded-lg p-4">
                  <p className="font-semibold">Shop the latest</p>
                  <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                    <li><Link href="#">Mac</Link></li>
                    <li><Link href="#">iPhone</Link></li>
                    <li><Link href="#">iPad</Link></li>
                    <li><Link href="#">Apple Watch</Link></li>
                  </ul>
                </div>
              </li>
              <li><Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300">About</Link></li>
              <li><Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Products</Link></li>
              <li><Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Services</Link></li>
              <li><Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Partners</Link></li>
              <li><Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Support</Link></li>
              <li><Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Contact</Link></li>
            </ul>
            {/* Dark mode toggle button with aria-pressed */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              onKeyDown={handleToggleKeyDown}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={darkMode}
              className="ml-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <span aria-hidden="true">{darkMode ? "🌙" : "☀️"}</span>
            </button>
          </nav>
        </header>
        <main id="main-content" className="pt-20">
          {children}
        </main>
        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 pt-12" aria-label="Site footer">
          {/* Top multi-column section */}
          <div className="flex justify-center w-full">
            <div className="max-w-6xl w-full border-t border-gray-200 dark:border-gray-800 mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full text-sm text-gray-600 dark:text-gray-300">
                <ul className="space-y-2 text-left flex-1">
                  <li className="font-semibold text-gray-800 dark:text-gray-100">Shop and Learn</li>
                  <li><Link href="#">Mac</Link></li>
                  <li><Link href="#">iPad</Link></li>
                  <li><Link href="#">iPhone</Link></li>
                  <li><Link href="#">Watch</Link></li>
                  <li><Link href="#">AirPods</Link></li>
                  <li><Link href="#">Accessories</Link></li>
                </ul>
                <ul className="space-y-2 text-left flex-1">
                  <li className="font-semibold text-gray-800 dark:text-gray-100">Account</li>
                  <li><Link href="#">Manage Your Account</Link></li>
                  <li><Link href="#">iCloud</Link></li>
                  <li><Link href="#">App Store</Link></li>
                </ul>
                <ul className="space-y-2 text-left flex-1">
                  <li className="font-semibold text-gray-800 dark:text-gray-100">Apple Store</li>
                  <li><Link href="#">Find a Store</Link></li>
                  <li><Link href="#">Genius Bar</Link></li>
                  <li><Link href="#">Today at Apple</Link></li>
                  <li><Link href="#">Financing</Link></li>
                  <li><Link href="#">Order Status</Link></li>
                </ul>
                <ul className="space-y-2 text-left flex-1">
                  <li className="font-semibold text-gray-800 dark:text-gray-100">For Business</li>
                  <li><Link href="#">Apple and Business</Link></li>
                  <li><Link href="#">Shop for Business</Link></li>
                  <li className="font-semibold text-gray-800 dark:text-gray-100 mt-4">For Education</li>
                  <li><Link href="#">Apple and Education</Link></li>
                  <li><Link href="#">Shop for College</Link></li>
                </ul>
                <ul className="space-y-2 text-left flex-1">
                  <li className="font-semibold text-gray-800 dark:text-gray-100">About MozWired</li>
                  <li><Link href="#">Newsroom</Link></li>
                  <li><Link href="#">Leadership</Link></li>
                  <li><Link href="#">Careers</Link></li>
                  <li><Link href="#">Investors</Link></li>
                  <li><Link href="#">Events</Link></li>
                  <li><Link href="#">Contact Apple</Link></li>
                </ul>
              </div>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="flex justify-center w-full">
            <div className="max-w-6xl w-full border-t border-gray-200 dark:border-gray-800 mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
              <p className="md:mr-4 text-left w-full md:w-auto">Copyright © {new Date().getFullYear()} MozWired Inc. All rights reserved.</p>
              <div className="flex gap-4 flex-wrap justify-center md:justify-center w-full md:w-auto">
                <Link href="#">Privacy Policy</Link>
                <Link href="#">Terms of Use</Link>
                <Link href="#">Legal</Link>
                <Link href="#">Site Map</Link>
              </div>
              <p className="md:ml-4 text-right w-full md:w-auto">Mozambique</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}


























// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="bg-slate-950 text-white">
//         <header className="border-b border-slate-800 py-4 px-6 sticky top-0 bg-slate-950 z-50">
//           <nav className="max-w-4xl mx-auto flex justify-between items-center">
//             <Link href="/" className="text-lg font-bold text-white">Osvaldo</Link>
//             <div className="flex gap-4 text-slate-300 text-sm">
//               <Link href="/about" className="hover:text-white">About</Link>
//               <Link href="/projects" className="hover:text-white">Projects</Link>
//               <Link href="/resume" className="hover:text-white">Resume</Link>
//               <Link href="/contact" className="hover:text-white">Contact</Link>
//             </div>
//           </nav>
//         </header>
        // <main>{children}</main>
        // <footer className="border-t border-slate-800 py-6 mt-12 text-center text-sm text-slate-500">
        //   © {new Date().getFullYear()} Osvaldo Panguana. All rights reserved.
        // </footer>
//       </body>
//     </html>
//   );
// }




