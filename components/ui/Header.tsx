import React from "react";
import Link from "next/link";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  return (
    <header className="fixed top-0 w-full bg-[#e3e3e3]/80 dark:bg-black/80 backdrop-blur-md border-b dark:border-white/10 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-13 flex items-center justify-center" aria-label="Main navigation">
        {/* Logo on the left */}
        <div className="flex-shrink-0 w-1/3">
          <Link href="#" className="text-lg font-bold">
            MozWired
          </Link>
        </div>

        {/* Navigation links: centered */}
        <ul className="hidden dark:text-gray-100 md:flex flex-1 justify-center items-center space-x-8 text-sm font-semibold w-1/3 text-gray-600">
          <li>
            <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Products
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Services
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Partners
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Support
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Contact
            </Link>
          </li>
        </ul>

        {/* Icons on the right */}
        <div className="flex items-center justify-end space-x-4 w-1/3">
          <button
            aria-label="Search"
            className="p-2 rounded dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Link href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="44"
                viewBox="0 0 15 44"
                className="fill-black dark:fill-white"
              >
                <path d="M14.298,27.202l-3.87-3.87c0.701-0.929,1.122-2.081,1.122-3.332c0-3.06-2.489-5.55-5.55-5.55
                  c-3.06,0-5.55,2.49-5.55,5.55 c0,3.061,2.49,5.50,5.55,5.55c1.251,0,2.403-0.421,3.332-1.122l3.87,3.87
                  c0.151,0.151,0.35,0.228,0.548,0.228 s0.396-0.076,0.548-0.228C14.601,27.995,14.601,27.505,14.298,27.202z 
                  M1.55,20c0-2.454,1.997-4.45,4.45-4.45 
                  c2.454,0,4.45,1.997,4.45,4.45S8.454,24.45,6,24.45C3.546,24.45,1.55,22.454,1.55,20z"></path>
              </svg>
            </Link>
          </button>

          <button
            aria-label="Shopping Bag"
            className="p-1.5 rounded-full hover:text-black/5 dark:hover:text-white/10focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Link href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="44"
                viewBox="0 0 14 44"
                className="fill-black dark:fill-white"
              >
                <path d="m11.3535 16.0283h-1.0205a3.4229 3.4229 0 0 0 -3.333-2.9648 3.4229 3.4229 0 0 0 -3.333 2.9648h-1.02a2.1184 2.1184 0 0 0 -2.117 2.1162v7.7155a2.1186 2.1186 0 0 0 2.1162 2.1167h8.707a2.1186 2.1186 0 0 0 2.1168-2.1167v-7.7155a2.1184 2.1184 0 0 0 -2.1165-2.1162zm-4.3535-1.8652a2.3169 2.3169 0 0 1 2.2222 1.8652h-4.4444a2.3169 2.3169 0 0 1 2.2222-1.8652zm5.37 11.6969a1.0182 1.0182 0 0 1 -1.0166 1.0171h-8.7069a1.0182 1.0182 0 0 1 -1.0165-1.0171v-7.7155a1.0178 1.0178 0 0 1 1.0166-1.0166h8.707a1.0178 1.0178 0 0 1 1.0164 1.0166z"></path>
              </svg>
            </Link>
          </button>

          <button
            onClick={() => setDarkMode((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setDarkMode((prev) => !prev);
            }}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={darkMode}
            tabIndex={0}
            className="ml-4 p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            <span aria-hidden="true" className="text-sm">
              {darkMode ? "🌙" : "☀️"}
            </span>
            <span className="sr-only">
              {darkMode ? "Dark mode enabled" : "Light mode enabled"}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};