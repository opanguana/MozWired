import type { SupportedCurrency } from '@/types/money';

export const currencyConfig = {
  baseCurrency: 'MZN',
  defaultCurrency: 'MZN',
  supportedCurrencies: ['MZN', 'USD', 'ZAR', 'EUR'],
  ratesUpdatedAt: '2026-07-08T15:30:00+02:00',
  maximumSuggestionRateAgeDays: 30,
  sourceName: 'Banco de Moçambique',
  sourceUrl: 'https://www.bancomoc.mz/en/',
  vatIncluded: false,
  commercialRounding: false,
  /**
   * Banco de Moçambique sell rates expressed as MZN minor units
   * required to buy one major unit of the selected currency.
   */
  mznMinorPerForeignMajor: {
    USD: 6_455,
    ZAR: 394,
    EUR: 7_359,
  },
} as const satisfies {
  baseCurrency: 'MZN';
  defaultCurrency: SupportedCurrency;
  supportedCurrencies: readonly SupportedCurrency[];
  ratesUpdatedAt: string;
  maximumSuggestionRateAgeDays: number;
  sourceName: string;
  sourceUrl: string;
  vatIncluded: boolean;
  commercialRounding: boolean;
  mznMinorPerForeignMajor: Record<Exclude<SupportedCurrency, 'MZN'>, number>;
};
