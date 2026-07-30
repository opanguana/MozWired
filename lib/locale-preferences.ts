import { localeConfig } from '@/config/locales';
import {
  supportedLanguages,
  supportedMarkets,
  type LocalePreferences,
  type MarketCode,
  type SupportedLanguage,
} from '@/types/locale';
import type { SupportedCurrency } from '@/types/money';

import { isSupportedCurrency, resolveSavedCurrency } from './currency-resolution';

export const LANGUAGE_COOKIE = 'mw_language';
export const MARKET_COOKIE = 'mw_market';

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return typeof value === 'string' && supportedLanguages.includes(value as SupportedLanguage);
}

export function normalizeLanguage(value: unknown): SupportedLanguage | undefined {
  if (value === 'pt') return 'pt-MZ';
  return isSupportedLanguage(value) ? value : undefined;
}

export function isSupportedMarket(value: unknown): value is MarketCode {
  return typeof value === 'string' && supportedMarkets.includes(value as MarketCode);
}

export function resolveLocalePreferences(values: {
  language?: unknown;
  market?: unknown;
  currency?: unknown;
}): LocalePreferences {
  const language = normalizeLanguage(values.language);
  return {
    language: language ?? localeConfig.defaultLanguage,
    market: isSupportedMarket(values.market) ? values.market : localeConfig.defaultMarket,
    currency: resolveSavedCurrency(values.currency),
  };
}

export function recommendedCurrencyForMarket(market: MarketCode): SupportedCurrency {
  return localeConfig.markets.find(({ code }) => code === market)?.recommendedCurrency ?? 'MZN';
}

export function effectiveDocumentLanguage(preference: SupportedLanguage): SupportedLanguage {
  return localeConfig.languages.find(({ code }) => code === preference)?.complete
    ? preference
    : localeConfig.defaultLanguage;
}

export function isValidLocalePreferences(value: unknown): value is LocalePreferences {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return (
    isSupportedLanguage(candidate.language) &&
    isSupportedMarket(candidate.market) &&
    isSupportedCurrency(candidate.currency)
  );
}
