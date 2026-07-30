import type { SupportedCurrency } from '@/types/money';
import exchangeRateDataSource from '@/data/exchange-rates.json';
import { latestExchangeRateRecord, validateExchangeRateData } from '@/lib/exchange-rates';

const exchangeRateData = validateExchangeRateData(exchangeRateDataSource);
const latestRates = latestExchangeRateRecord(exchangeRateData);

export const currencyConfig = {
  baseCurrency: 'MZN',
  defaultCurrency: 'MZN',
  supportedCurrencies: ['MZN', 'USD', 'ZAR', 'EUR'],
  ratesUpdatedAt: latestRates.effectiveAt,
  maximumSuggestionRateAgeDays: 30,
  sourceName: latestRates.source,
  sourceUrl: latestRates.sourceUrl,
  vatIncluded: false,
  commercialRounding: false,
  /**
   * Banco de Moçambique sell rates expressed as MZN minor units
   * required to buy one major unit of the selected currency.
   */
  mznMinorPerForeignMajor: latestRates.mznMinorPerForeignMajor,
} satisfies {
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
