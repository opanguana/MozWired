export const supportedLanguages = ['en', 'pt'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const supportedMarkets = ['MZ', 'ZA', 'US', 'EU'] as const;
export type MarketCode = (typeof supportedMarkets)[number];

export type LocalePreferences = {
  language: SupportedLanguage;
  market: MarketCode;
  currency: import('./money').SupportedCurrency;
};
