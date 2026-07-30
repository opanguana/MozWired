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
import { isSupportedCurrency } from '@/lib/currency-resolution';
import type { SupportedCurrency } from '@/types/money';

const STORAGE_KEY = 'mozwired-currency';

type CurrencyContextValue = {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  preferenceReady: boolean;
  hasExplicitPreference: boolean;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: currencyConfig.defaultCurrency,
  setCurrency: () => undefined,
  preferenceReady: false,
  hasExplicitPreference: false,
});

export function CurrencyProvider({
  children,
  initialCurrency = currencyConfig.defaultCurrency,
  hasSavedCurrency = false,
}: {
  children: ReactNode;
  initialCurrency?: SupportedCurrency;
  hasSavedCurrency?: boolean;
}) {
  const [currency, updateCurrency] = useState<SupportedCurrency>(initialCurrency);
  const [preferenceReady, setPreferenceReady] = useState(false);
  const [hasExplicitPreference, setHasExplicitPreference] = useState(hasSavedCurrency);

  useEffect(() => {
    try {
      const storedCurrency = window.localStorage.getItem(STORAGE_KEY);
      if (!hasSavedCurrency && storedCurrency && isSupportedCurrency(storedCurrency)) {
        updateCurrency(storedCurrency);
        setHasExplicitPreference(true);
        void persistCurrency(storedCurrency);
      }
    } catch {
      // Storage may be unavailable in privacy-restricted browsing contexts.
    } finally {
      setPreferenceReady(true);
    }
  }, [hasSavedCurrency]);

  const setCurrency = useCallback((nextCurrency: SupportedCurrency) => {
    updateCurrency(nextCurrency);
    setHasExplicitPreference(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextCurrency);
    } catch {
      // The in-memory selection remains usable when persistence is unavailable.
    }
    void persistCurrency(nextCurrency);
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency, preferenceReady, hasExplicitPreference }),
    [currency, setCurrency, preferenceReady, hasExplicitPreference]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

async function persistCurrency(currency: SupportedCurrency) {
  try {
    await fetch('/api/currency', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ currency }),
    });
  } catch {
    // The in-memory and local preferences remain usable if the request fails.
  }
}
