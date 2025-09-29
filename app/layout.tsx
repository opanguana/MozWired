"use client";

// File: app/layout.tsx
import "./globals.css";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";


// Key for localStorage dark mode preference
const DARK_MODE_KEY = "darkMode";


/**
 * App layout component for consistent header, footer, and dark mode support.
 * - Persists dark mode preference in localStorage
 * - Provides skip link for accessibility
 * - Wraps all pages with header and footer
 */
export default function Home({ children }:{children:ReactNode}) {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage on mount
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
        {/* Accessibility: Skip to main content */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50">
          Skip to main content
        </a>
        {/* Global header with dark mode toggle */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main id="main-content" className="pt-0">
          {children}
        </main>
        {/* Global footer */}
        <Footer />
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




