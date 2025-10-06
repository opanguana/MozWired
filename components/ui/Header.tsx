import React, { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

  const navItems = ["Home", "About", "Products", "Services", "Partners", "Support", "Contact"];

  return (
    <header className="fixed top-0 w-full bg-gray-100/80 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200/60 dark:border-white/10 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
        
        {/* Logo - Enhanced */}
        <div className="flex-shrink-0">
          <Link 
            href="#" 
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            MozWired
          </Link>
        </div>

        {/* Navigation Links - Improved */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center space-x-1">
            {navItems.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  onClick={() => setActiveLink(item)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeLink === item
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item}
                  {activeLink === item && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons - Enhanced */}
        <div className="flex items-center justify-end space-x-3">
          
          {/* Search with Expandable Input */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1">
                <input
                  type="text"
                  placeholder="Search mozwired..."
                  autoFocus
                  className="w-200 pl-3 pr-10 py-2 bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500"
                  onBlur={() => setIsSearchOpen(false)}
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="Search"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* Shopping Cart with Badge */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Shopping cart"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Dark Mode Toggle - Enhanced */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setDarkMode(!darkMode);
            }}
            className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 group"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <span
                className={`absolute transition-all duration-500 transform ${
                  darkMode
                    ? 'opacity-0 rotate-90 scale-0'
                    : 'opacity-100 rotate-0 scale-100'
                }`}
              >
                ☀️
              </span>
              <span
                className={`absolute transition-all duration-500 transform ${
                  darkMode
                    ? 'opacity-100 rotate-0 scale-100'
                    : 'opacity-0 -rotate-90 scale-0'
                }`}
              >
                🌙
              </span>
            </div>
          </button>

          {/* User Profile/CTA */}
          <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <span className="text-sm font-medium">Get Started</span>
          </button>
        </div>
      </nav>
    </header>
  );
};