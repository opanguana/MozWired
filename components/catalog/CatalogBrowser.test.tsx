import { fireEvent, render, screen, within } from '@testing-library/react';

import type { CatalogListingItem } from '@/catalog/listing';
import { mznPrice } from '@/types/money';

import { CatalogBrowser } from './CatalogBrowser';

const replace = jest.fn();
let query = '';

jest.mock('next/navigation', () => ({
  usePathname: () => '/products',
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(query),
}));

const items: CatalogListingItem[] = [
  {
    slug: 'alpha',
    href: '/products/alpha',
    brand: 'Lenovo',
    title: 'Alpha computer',
    category: 'computers',
    description: 'Alpha',
    price: mznPrice(200_000),
    availability: ['in_stock'],
    conditions: ['new'],
    processors: ['Core 5'],
    ram: ['8GB'],
    storage: ['256GB'],
    network: [],
    specification: 'Core 5 · 8GB RAM',
    featuredRank: 1,
  },
  {
    slug: 'beta',
    href: '/products/beta',
    brand: 'Samsung',
    title: 'Beta phone',
    category: 'phones',
    description: 'Beta',
    price: mznPrice(100_000),
    availability: ['contact'],
    conditions: ['new'],
    processors: [],
    ram: ['4GB'],
    storage: ['128GB'],
    network: ['4G'],
    specification: '4GB RAM · 128GB',
    featuredRank: 0,
  },
];

describe('CatalogBrowser', () => {
  beforeEach(() => {
    query = '';
    replace.mockClear();
  });

  it('filters from the URL and clears all filters', () => {
    query = 'category=computers&brand=Lenovo';
    render(<CatalogBrowser items={items} />);

    expect(screen.getByRole('link', { name: 'View Alpha computer details' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View Beta phone details' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(replace).toHaveBeenLastCalledWith('/products', { scroll: false });
    expect(screen.getByRole('link', { name: 'View Beta phone details' })).toBeInTheDocument();
  });

  it('sorts products and writes the choice to the URL', () => {
    render(<CatalogBrowser items={items} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Sort products' }), {
      target: { value: 'price-asc' },
    });

    const cards = screen.getAllByRole('article');
    expect(within(cards[0]).getByRole('heading', { name: 'Beta phone' })).toBeInTheDocument();
    expect(replace).toHaveBeenLastCalledWith('/products?sort=price-asc', { scroll: false });
  });

  it('opens an accessible mobile filter dialog', () => {
    render(<CatalogBrowser items={items} />);
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByRole('dialog', { name: 'Product filters' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close filters' }));
    expect(screen.queryByRole('dialog', { name: 'Product filters' })).not.toBeInTheDocument();
  });

  it('shows a recoverable empty state for incompatible filters', () => {
    render(<CatalogBrowser items={items} />);
    fireEvent.click(screen.getByRole('checkbox', { name: /Lenovo/ }));
    fireEvent.click(screen.getByRole('button', { name: /Phones/ }));

    expect(
      screen.getByRole('heading', { name: 'No products match these filters' })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('link', { name: 'View Beta phone details' })).toBeInTheDocument();
  });
});
