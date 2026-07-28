import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { mznPrice } from '@/types/money';

import { CurrencyProvider } from './CurrencyProvider';
import { CurrencySelector } from './CurrencySelector';
import { ProductPrice } from './ProductPrice';

function CurrencyFixture() {
  return (
    <CurrencyProvider>
      <CurrencySelector />
      <ProductPrice price={mznPrice(1_055_000)} />
    </CurrencyProvider>
  );
}

describe('currency preference', () => {
  beforeEach(() => window.localStorage.clear());

  it('defaults to MZN and persists another supported currency', () => {
    render(<CurrencyFixture />);

    const selector = screen.getByRole('combobox', { name: 'Display currency' });
    expect(selector).toHaveValue('MZN');
    expect(screen.getByText(/MZN\s*10,550/)).toBeInTheDocument();

    fireEvent.change(selector, { target: { value: 'USD' } });

    expect(selector).toHaveValue('USD');
    expect(window.localStorage.getItem('mozwired-currency')).toBe('USD');
    expect(screen.getByText(/Approx\. USD\s*163\.44/)).toBeInTheDocument();
  });

  it('restores a supported persisted currency after hydration', async () => {
    window.localStorage.setItem('mozwired-currency', 'EUR');
    render(<CurrencyFixture />);

    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Display currency' })).toHaveValue('EUR')
    );
    expect(screen.getByText(/Approx\. EUR\s*143\.36/)).toBeInTheDocument();
  });
});
