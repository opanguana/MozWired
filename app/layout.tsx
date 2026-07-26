import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { Header } from '@/components/ui/Header';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MozWired Store',
  description: 'Technology services and secure infrastructure for growing teams.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-store-canvas font-sans text-store-ink antialiased`}>
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-white px-4 py-2 text-sm font-semibold text-black focus:not-sr-only"
        >
          Skip to main content
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}
