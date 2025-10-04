import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => (
  <footer className="bg-gray-100 dark:bg-black/80 pt-12" aria-label="Site footer">
    <div className="flex justify-center w-full">
      <div className="max-w-6xl w-full border-t border-gray-200 dark:border-gray-800 mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full text-sm text-gray-600 dark:text-gray-300">
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">Solutions</li>
            <li><Link href="#">Infrastructure</Link></li>
            <li><Link href="#">Networks</Link></li>
            <li><Link href="#">Security</Link></li>
            <li><Link href="#">Data</Link></li>
            <li><Link href="#">Identity</Link></li>
            <li><Link href="#">Applications</Link></li>
          </ul>
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">Account</li>
            <li><Link href="#">Manage Your Account</Link></li>
            <li><Link href="#">Cloud</Link></li>
            <li><Link href="#">App Store</Link></li>
          </ul>
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">MozWired Store</li>
            <li><Link href="#">Find a Store</Link></li>
            <li><Link href="#">Today at MozWired</Link></li>
            <li><Link href="#">Financing</Link></li>
            <li><Link href="#">Order Status</Link></li>
          </ul>
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">For Business</li>
            <li><Link href="#">MozWired and Business</Link></li>
            <li><Link href="#">Shop for Business</Link></li>
            <li className="font-semibold text-gray-800 dark:text-gray-100 mt-4">For Education</li>
            <li><Link href="#">MozWired and Education</Link></li>
            <li><Link href="#">Shop for College</Link></li>
          </ul>
          <ul className="space-y-2 text-left flex-1">
            <li className="font-semibold text-gray-800 dark:text-gray-100">About MozWired</li>
            <li><Link href="#">Newsroom</Link></li>
            <li><Link href="#">Leadership</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Investors</Link></li>
            <li><Link href="#">Events</Link></li>
            <li><Link href="#">Contact MozWired</Link></li>
          </ul>
        </div>
      </div>
    </div>
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
);
