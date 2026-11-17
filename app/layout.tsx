import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

import { CurrencyProvider } from '@/components/currency/CurrencyProvider';
import { CurrencySuggestion } from '@/components/currency/CurrencySuggestion';
import { Footer } from '@/components/ui/Footer';
import { Header } from '@/components/ui/Header';
import { CURRENCY_COOKIE, isSupportedCurrency } from '@/lib/currency-resolution';
import { translate } from '@/lib/i18n/dictionaries';
import {
  effectiveDocumentLanguage,
  isSupportedMarket,
  LANGUAGE_COOKIE,
  MARKET_COOKIE,
  normalizeLanguage,
  resolveLocalePreferences,
} from '@/lib/locale-preferences';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const metadataBase = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  : new URL('http://localhost:3000');

export const metadata: Metadata = {
  metadataBase,
  title: 'MozWired Store',
  description: 'Technology services and secure infrastructure for growing teams.',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'MozWired Store',
    title: 'MozWired Store',
    description: 'Technology services and secure infrastructure for growing teams.',
    images: [
      {
        url: '/LinkPreviewImage.png',
        width: 1200,
        height: 630,
        alt: 'MozWired',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MozWired Store',
    description: 'Technology services and secure infrastructure for growing teams.',
    images: ['/LinkPreviewImage.png'],
  },
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const savedCurrency = cookieStore.get(CURRENCY_COOKIE)?.value;
  const savedLanguage = cookieStore.get(LANGUAGE_COOKIE)?.value;
  const savedMarket = cookieStore.get(MARKET_COOKIE)?.value;
  const preferences = resolveLocalePreferences({
    language: savedLanguage,
    market: savedMarket,
    currency: savedCurrency,
  });
  const hasSavedPreferences =
    Boolean(normalizeLanguage(savedLanguage)) ||
    isSupportedMarket(savedMarket) ||
    isSupportedCurrency(savedCurrency);

  return (
    <html lang={effectiveDocumentLanguage(preferences.language)}>
      <body className={`${inter.variable} bg-store-canvas font-sans text-store-ink antialiased`}>
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-white px-4 py-2 text-sm font-semibold text-black focus:not-sr-only"
        >
          {translate(preferences.language, 'accessibility.skipToMain')}
        </a>
        <CurrencyProvider
          initialLanguage={preferences.language}
          initialMarket={preferences.market}
          initialCurrency={preferences.currency}
          hasSavedPreferences={hasSavedPreferences}
        >
          <Header />
          <CurrencySuggestion />
          {children}
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
