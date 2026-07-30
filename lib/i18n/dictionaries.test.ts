import { translate } from './dictionaries';

describe('translation dictionaries', () => {
  it('resolves English messages and interpolation', () => {
    expect(
      translate('en', 'preferences.applied', {
        language: 'EN',
        market: 'MZ',
        currency: 'MZN',
      })
    ).toBe('Preferences applied: EN, MZ, MZN.');
  });

  it('falls back to English without exposing a translation key', () => {
    const warning = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(translate('pt-MZ', 'accessibility.skipToMain')).toBe('Skip to main content');
    expect(warning).toHaveBeenCalledWith(
      '[i18n:pt-MZ] Missing translation for "accessibility.skipToMain"; using English.'
    );

    warning.mockRestore();
  });
});
