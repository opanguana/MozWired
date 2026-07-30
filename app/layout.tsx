import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

import { CurrencyProvider } from '@/components/currency/CurrencyProvider';
import { CurrencySuggestion } from '@/components/currency/CurrencySuggestion';
import { Footer } from '@/components/ui/Footer';
import { Header } from '@/components/ui/Header';
import { CURRENCY_COOKIE, isSupportedCurrency } from '@/lib/currency-resolution';
import {
  effectiveDocumentLanguage,
  isSupportedLanguage,
  isSupportedMarket,
  LANGUAGE_COOKIE,
  MARKET_COOKIE,
  resolveLocalePreferences,
} from '@/lib/locale-preferences';

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
    isSupportedLanguage(savedLanguage) ||
    isSupportedMarket(savedMarket) ||
    isSupportedCurrency(savedCurrency);

  return (
    <html lang={effectiveDocumentLanguage(preferences.language)}>
      <body className={`${inter.variable} bg-store-canvas font-sans text-store-ink antialiased`}>
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-white px-4 py-2 text-sm font-semibold text-black focus:not-sr-only"
        >
          Skip to main content
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
