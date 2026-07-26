"use client";

// File: app/layout.tsx
import "./globals.css";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
      <body className={`${inter.variable} min-h-screen bg-gray-100 font-sans dark:bg-gray-950 dark:text-gray-100`}>
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
