'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { currencyConfig } from '@/config/currencies';
import { localeConfig } from '@/config/locales';
import { isSupportedCurrency } from '@/lib/currency-resolution';
import { effectiveDocumentLanguage } from '@/lib/locale-preferences';
import type { LocalePreferences, MarketCode, SupportedLanguage } from '@/types/locale';
import type { SupportedCurrency } from '@/types/money';

const STORAGE_KEY = 'mozwired-currency';

type CurrencyContextValue = {
  language: SupportedLanguage;
  market: MarketCode;
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  setPreferences: (preferences: LocalePreferences) => void;
  preferenceReady: boolean;
  hasExplicitPreference: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  language: localeConfig.defaultLanguage,
  market: localeConfig.defaultMarket,
  currency: currencyConfig.defaultCurrency,
  setCurrency: () => undefined,
  setPreferences: () => undefined,
  preferenceReady: false,
  hasExplicitPreference: false,
});

export function CurrencyProvider({
  children,
  initialLanguage = localeConfig.defaultLanguage,
  initialMarket = localeConfig.defaultMarket,
  initialCurrency = currencyConfig.defaultCurrency,
  hasSavedPreferences = false,
}: {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
  initialMarket?: MarketCode;
  initialCurrency?: SupportedCurrency;
  hasSavedPreferences?: boolean;
}) {
  const [language, updateLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [market, updateMarket] = useState<MarketCode>(initialMarket);
  const [currency, updateCurrency] = useState<SupportedCurrency>(initialCurrency);
  const [preferenceReady, setPreferenceReady] = useState(false);
  const [hasExplicitPreference, setHasExplicitPreference] = useState(hasSavedPreferences);

  useEffect(() => {
    try {
      const storedCurrency = window.localStorage.getItem(STORAGE_KEY);
      if (!hasSavedPreferences && storedCurrency && isSupportedCurrency(storedCurrency)) {
        updateCurrency(storedCurrency);
        setHasExplicitPreference(true);
        void persistPreferences({
          language: initialLanguage,
          market: initialMarket,
          currency: storedCurrency,
        });
      }
    } catch {
      // Storage may be unavailable in privacy-restricted browsing contexts.
    } finally {
      setPreferenceReady(true);
    }
  }, [hasSavedPreferences, initialLanguage, initialMarket]);

  useEffect(() => {
    document.documentElement.lang = effectiveDocumentLanguage(language);
  }, [language]);

  const setPreferences = useCallback((nextPreferences: LocalePreferences) => {
    updateLanguage(nextPreferences.language);
    updateMarket(nextPreferences.market);
    updateCurrency(nextPreferences.currency);
    setHasExplicitPreference(true);
    saveLegacyCurrency(nextPreferences.currency);
    void persistPreferences(nextPreferences);
  }, []);

  const setCurrency = useCallback(
    (nextCurrency: SupportedCurrency) => {
      setPreferences({ language, market, currency: nextCurrency });
    },
    [language, market, setPreferences]
  );

  const value = useMemo(
    () => ({
      language,
      market,
      currency,
      setCurrency,
      setPreferences,
      preferenceReady,
      hasExplicitPreference,
    }),
    [
      language,
      market,
      currency,
      setCurrency,
      setPreferences,
      preferenceReady,
      hasExplicitPreference,
    ]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

function saveLegacyCurrency(currency: SupportedCurrency) {
  try {
    window.localStorage.setItem(STORAGE_KEY, currency);
  } catch {
    // Cookie persistence still works when local storage is unavailable.
  }
}

async function persistPreferences(preferences: LocalePreferences) {
  try {
    await fetch('/api/preferences', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(preferences),
    });
  } catch {
    // The in-memory and local preferences remain usable if the request fails.
  }
}
