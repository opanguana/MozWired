import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => (
  <footer className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl pt-12" aria-label="Site footer">
    <div className="flex justify-center w-full">
      <div className="max-w-7xl w-full border-t border-gray-200/60 dark:border-white/10 mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 w-full text-sm text-gray-600 dark:text-gray-300">
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">Solutions</li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Infrastructure</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Networks</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Security</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Data</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Identity</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Applications</Link></li>
          </ul>
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">Account</li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Manage Your Account</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Cloud</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">App Store</Link></li>
          </ul>
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">MozWired Store</li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Find a Store</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Today at MozWired</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Financing</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Order Status</Link></li>
          </ul>
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">For Business</li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">MozWired and Business</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Shop for Business</Link></li>
            <li className="font-semibold text-gray-800 dark:text-gray-100 mt-4">For Education</li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">MozWired and Education</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Shop for College</Link></li>
          </ul>
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">About MozWired</li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Newsroom</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Leadership</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Careers</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Investors</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Events</Link></li>
            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Contact MozWired</Link></li>
          </ul>
          
          {/* Newsletter Signup */}
          <div className="mt-6 p-8 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Stay Updated</h4>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-center w-full">
      <div className="max-w-7xl w-full border-t border-gray-200/60 dark:border-white/10 mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="md:mr-4 text-left w-full md:w-auto">Copyright © {new Date().getFullYear()} MozWired Inc. All rights reserved.</p>
        <div className="flex gap-4 flex-wrap justify-center md:justify-center w-full md:w-auto">
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Privacy Policy</Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Terms of Use</Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Legal</Link>
          <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Site Map</Link>
        </div>
        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>Mozambique</span>
        </div>
      </div>
    </div>
  </footer>
);