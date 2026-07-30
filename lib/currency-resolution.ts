import { currencyConfig } from '@/config/currencies';
import { supportedCurrencies, type SupportedCurrency } from '@/types/money';

export const CURRENCY_COOKIE = 'mw_currency';

const euroMarkets = new Set([
  'AT',
  'BE',
  'CY',
  'DE',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PT',
  'SI',
  'SK',
]);

const randMarkets = new Set(['ZA', 'LS', 'SZ', 'NA']);

export function isSupportedCurrency(value: unknown): value is SupportedCurrency {
  return typeof value === 'string' && supportedCurrencies.includes(value as SupportedCurrency);
}

export function resolveSavedCurrency(value: unknown): SupportedCurrency {
  return isSupportedCurrency(value) ? value : currencyConfig.defaultCurrency;
}

export function suggestedCurrencyForCountry(
  countryCode: string | null | undefined
): SupportedCurrency | null {
  const country = countryCode?.trim().toUpperCase();
  if (!country) return null;
  if (country === 'MZ') return 'MZN';
  if (country === 'US') return 'USD';
  if (randMarkets.has(country)) return 'ZAR';
  if (euroMarkets.has(country)) return 'EUR';
  return null;
}

export function rateAgeInDays(now = new Date()) {
  return Math.floor((now.getTime() - Date.parse(currencyConfig.ratesUpdatedAt)) / 86_400_000);
}

export function canSuggestConvertedCurrency(now = new Date()) {
  return rateAgeInDays(now) <= currencyConfig.maximumSuggestionRateAgeDays;
}
