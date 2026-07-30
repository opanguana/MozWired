import {
  effectiveDocumentLanguage,
  isValidLocalePreferences,
  recommendedCurrencyForMarket,
  resolveLocalePreferences,
} from './locale-preferences';

describe('locale preferences', () => {
  it('falls back safely when saved values are invalid', () => {
    expect(
      resolveLocalePreferences({
        language: 'xx',
        market: 'unknown',
        currency: 'GBP',
      })
    ).toEqual({ language: 'en', market: 'MZ', currency: 'MZN' });
  });

  it('recommends but does not force the market currency', () => {
    expect(recommendedCurrencyForMarket('MZ')).toBe('MZN');
    expect(recommendedCurrencyForMarket('ZA')).toBe('ZAR');
    expect(recommendedCurrencyForMarket('US')).toBe('USD');
    expect(recommendedCurrencyForMarket('EU')).toBe('EUR');
  });

  it('validates complete preference payloads', () => {
    expect(
      isValidLocalePreferences({
        language: 'pt-MZ',
        market: 'MZ',
        currency: 'USD',
      })
    ).toBe(true);
    expect(isValidLocalePreferences({ language: 'pt-MZ', market: 'MZ' })).toBe(false);
  });

  it('keeps the document language truthful until Portuguese content exists', () => {
    expect(effectiveDocumentLanguage('en')).toBe('en');
    expect(effectiveDocumentLanguage('pt-MZ')).toBe('en');
  });

  it('migrates the legacy Portuguese preference to pt-MZ', () => {
    expect(resolveLocalePreferences({ language: 'pt' }).language).toBe('pt-MZ');
  });
});
