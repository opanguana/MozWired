import {
  canSuggestConvertedCurrency,
  isSupportedCurrency,
  resolveSavedCurrency,
  suggestedCurrencyForCountry,
} from './currency-resolution';

describe('currency and market resolution', () => {
  it('accepts only configured currencies and otherwise falls back to MZN', () => {
    expect(isSupportedCurrency('EUR')).toBe(true);
    expect(isSupportedCurrency('GBP')).toBe(false);
    expect(resolveSavedCurrency('USD')).toBe('USD');
    expect(resolveSavedCurrency('invalid')).toBe('MZN');
  });

  it('maps only explicitly supported markets to a suggestion', () => {
    expect(suggestedCurrencyForCountry('MZ')).toBe('MZN');
    expect(suggestedCurrencyForCountry('ZA')).toBe('ZAR');
    expect(suggestedCurrencyForCountry('DE')).toBe('EUR');
    expect(suggestedCurrencyForCountry('US')).toBe('USD');
    expect(suggestedCurrencyForCountry('AO')).toBeNull();
  });

  it('suppresses foreign suggestions when rates are stale', () => {
    expect(canSuggestConvertedCurrency(new Date('2026-08-01T00:00:00+02:00'))).toBe(true);
    expect(canSuggestConvertedCurrency(new Date('2026-09-01T00:00:00+02:00'))).toBe(false);
  });
});
