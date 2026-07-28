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
import { supportedCurrencies, type SupportedCurrency } from '@/types/money';

const STORAGE_KEY = 'mozwired-currency';

type CurrencyContextValue = {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: currencyConfig.defaultCurrency,
  setCurrency: () => undefined,
});

function isSupportedCurrency(value: string): value is SupportedCurrency {
  return supportedCurrencies.includes(value as SupportedCurrency);
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, updateCurrency] = useState<SupportedCurrency>(currencyConfig.defaultCurrency);

  useEffect(() => {
    try {
      const storedCurrency = window.localStorage.getItem(STORAGE_KEY);
      if (storedCurrency && isSupportedCurrency(storedCurrency)) {
        updateCurrency(storedCurrency);
      }
    } catch {
      // Storage may be unavailable in privacy-restricted browsing contexts.
    }
  }, []);

  const setCurrency = useCallback((nextCurrency: SupportedCurrency) => {
    updateCurrency(nextCurrency);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextCurrency);
    } catch {
      // The in-memory selection remains usable when persistence is unavailable.
    }
  }, []);

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
