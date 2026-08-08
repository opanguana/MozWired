import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { CurrencyProvider } from '@/components/currency/CurrencyProvider';
import type { ProductSearchItem } from '@/catalog/search';
import { mznPrice, type SupportedCurrency } from '@/types/money';

import { ProductSearch } from './ProductSearch';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const items: ProductSearchItem[] = [
  {
    slug: 'galaxy-a06',
    title: 'Galaxy A06',
    brand: 'Samsung',
    category: 'phones',
    description: 'A practical smartphone for everyday communication.',
    specifications: ['128GB', '4GB', '4G'],
    price: mznPrice(855_000),
    image: '/images/products/samsung/galaxy-a06/main.png',
  },
  {
    slug: 'targus-tbb565gl-74',
    title: 'Targus Intellect',
    brand: 'Targus',
    category: 'accessories',
    description: 'A lightweight laptop backpack with padded protection.',
    specifications: ['Black'],
    price: mznPrice(320_000),
    image: null,
  },
];

function renderSearch(currency: SupportedCurrency = 'MZN') {
  return render(
    <CurrencyProvider initialCurrency={currency} hasSavedPreferences>
      <ProductSearch items={items} />
    </CurrencyProvider>
  );
}

describe('ProductSearch', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('opens, focuses the input, closes with Escape and restores trigger focus', async () => {
    renderSearch();
    const trigger = screen.getByRole('button', { name: 'Search products' });
    fireEvent.click(trigger);

    const input = screen.getByRole('combobox', { name: 'Search products' });
    expect(input).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(document.body.style.overflow).toBe('');
  });

  it('toggles from the trigger and closes when the backdrop is clicked', async () => {
    renderSearch();
    const trigger = screen.getByRole('button', { name: 'Search products' });

    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());

    fireEvent.click(trigger);
    const backdrop = screen.getByRole('dialog').parentElement!;
    fireEvent.mouseDown(backdrop);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('matches case-insensitively across customer-facing catalogue fields', () => {
    renderSearch();
    fireEvent.click(screen.getByRole('button', { name: 'Search products' }));
    const input = screen.getByRole('combobox', { name: 'Search products' });

    fireEvent.change(input, { target: { value: 'SAMSUNG 128gb' } });
    expect(screen.getByRole('option', { name: /Galaxy A06/i })).toBeInTheDocument();
    expect(screen.queryByText('Targus Intellect')).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'padded protection' } });
    expect(screen.getByRole('option', { name: /Targus Intellect/i })).toBeInTheDocument();
  });

  it('shows an empty state and never exposes inventory SKUs', () => {
    renderSearch();
    fireEvent.click(screen.getByRole('button', { name: 'Search products' }));
    const input = screen.getByRole('combobox', { name: 'Search products' });

    expect(screen.queryByText(/TMP-TAR|TBB565GL/i)).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'does-not-exist' } });
    expect(screen.getByText(/No products match/i)).toBeInTheDocument();
  });

  it('uses stable product routes for pointer and keyboard selection', () => {
    renderSearch();
    fireEvent.click(screen.getByRole('button', { name: 'Search products' }));
    const input = screen.getByRole('combobox', { name: 'Search products' });
    const targusLink = screen.getByRole('option', { name: /Targus Intellect/i });
    expect(targusLink).toHaveAttribute('href', '/products/targus-tbb565gl-74');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(push).toHaveBeenCalledWith('/products/targus-tbb565gl-74');
  });

  it('formats prices with the active currency and uses a viewport-safe dialog', () => {
    renderSearch('EUR');
    fireEvent.click(screen.getByRole('button', { name: 'Search products' }));

    expect(screen.getAllByText(/Approx\.\s*EUR/).length).toBeGreaterThan(0);
    expect(screen.getByRole('dialog').parentElement).toHaveClass(
      'safe-overlay-padding',
      'overflow-x-hidden'
    );
    expect(screen.getByRole('dialog')).toHaveClass('flex', 'max-h-full', 'w-full', 'max-w-2xl');
  });
});
