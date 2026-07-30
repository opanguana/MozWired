import type { MarketCode, SupportedLanguage } from '@/types/locale';
import type { SupportedCurrency } from '@/types/money';

export const localeConfig = {
  defaultLanguage: 'en',
  defaultMarket: 'MZ',
  languages: [
    { code: 'en', label: 'English', complete: true },
    { code: 'pt-MZ', label: 'Português (Moçambique)', complete: false },
  ],
  markets: [
    { code: 'MZ', label: 'Mozambique', recommendedCurrency: 'MZN' },
    { code: 'ZA', label: 'South Africa', recommendedCurrency: 'ZAR' },
    { code: 'US', label: 'United States', recommendedCurrency: 'USD' },
    { code: 'EU', label: 'Euro area', recommendedCurrency: 'EUR' },
  ],
} as const satisfies {
  defaultLanguage: SupportedLanguage;
  defaultMarket: MarketCode;
  languages: readonly {
    code: SupportedLanguage;
    label: string;
    complete: boolean;
  }[];
  markets: readonly {
    code: MarketCode;
    label: string;
    recommendedCurrency: SupportedCurrency;
  }[];
};
