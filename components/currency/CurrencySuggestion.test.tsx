import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { CurrencyProvider } from './CurrencyProvider';
import { CurrencySuggestion } from './CurrencySuggestion';

describe('CurrencySuggestion', () => {
  beforeEach(() => {
    window.localStorage.clear();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ suggestion: { country: 'ZA', currency: 'ZAR' } }),
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('requires confirmation before applying a location suggestion', async () => {
    render(
      <CurrencyProvider>
        <CurrencySuggestion />
      </CurrencyProvider>
    );

    const accept = await screen.findByRole('button', { name: 'Use ZAR' });
    expect(window.localStorage.getItem('mozwired-currency')).toBeNull();

    fireEvent.click(accept);

    expect(window.localStorage.getItem('mozwired-currency')).toBe('ZAR');
  });

  it('does not request a suggestion when an explicit preference exists', async () => {
    render(
      <CurrencyProvider initialCurrency="EUR" hasSavedCurrency>
        <CurrencySuggestion />
      </CurrencyProvider>
    );

    await waitFor(() => expect(global.fetch).not.toHaveBeenCalled());
    expect(screen.queryByLabelText('Currency suggestion')).not.toBeInTheDocument();
  });
});
