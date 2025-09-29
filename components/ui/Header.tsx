import React from "react";
import Link from "next/link";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => (
  <header className="fixed top-0 w-full bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur z-50" role="banner">
    <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3" aria-label="Main navigation">
      <div className="text-xl font-semibold pr-6">MozWired</div>
      <ul className="hidden md:flex space-x-6 text-sm">
        <li className="relative group">
          <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300" aria-current="page">Home</Link>
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
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") setDarkMode(prev => !prev);
        }}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={darkMode}
        tabIndex={0}
        className="ml-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      >
        <span aria-hidden="true">{darkMode ? "🌙" : "☀️"}</span>
        <span className="sr-only">{darkMode ? "Dark mode enabled" : "Light mode enabled"}</span>
      </button>
    </nav>
  </header>
);
