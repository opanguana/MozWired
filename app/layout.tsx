// File: app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <header className="border-b border-slate-800 py-4 px-6 sticky top-0 bg-slate-950 z-50">
          <nav className="max-w-4xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-lg font-bold text-white">Osvaldo</Link>
            <div className="flex gap-4 text-slate-300 text-sm">
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/projects" className="hover:text-white">Projects</Link>
              <Link href="/resume" className="hover:text-white">Resume</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-slate-800 py-6 mt-12 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Osvaldo Panguana. All rights reserved.
        </footer>
      </body>
    </html>
  );
}