import { render, screen } from '@testing-library/react';

import type { CatalogListingItem } from '@/catalog/listing';
import { mznPrice } from '@/types/money';

import { CatalogCard } from './CatalogCard';

const item: CatalogListingItem = {
  slug: 'test-product',
  href: '/products/test-product',
  brand: 'Lenovo',
  title: 'Test product',
  category: 'computers',
  description: 'Test description',
  image: '/images/products/lenovo/ideapad-1-15iau7/main.png',
  price: mznPrice(100_000),
  availability: ['in_stock'],
  conditions: ['new'],
  processors: ['Core 5'],
  ram: ['8GB'],
  storage: ['256GB'],
  network: [],
  specification: 'Core 5 · 8GB RAM · 256GB',
  featuredRank: 0,
};

describe('CatalogCard', () => {
  it('uses a pure white surface with a subtle internal edge', () => {
    render(<CatalogCard item={item} />);

    expect(screen.getByRole('article')).toHaveClass(
      'relative',
      'isolate',
      'overflow-hidden',
      'bg-white',
      'border-transparent',
      'after:pointer-events-none',
      'after:absolute',
      'after:inset-0',
      'after:rounded-[inherit]',
      'after:shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]'
    );
    expect(screen.getByRole('article')).not.toHaveClass(
      'bg-[#151517]',
      'border-white/10',
      'shadow-lg'
    );
  });

  it('preserves card content, dimensions and product-detail navigation', () => {
    render(<CatalogCard item={item} />);

    expect(screen.getByRole('article')).toHaveClass('min-h-[25rem]', 'p-4');
    expect(screen.getByRole('link', { name: 'View Test product details' })).toHaveAttribute(
      'href',
      '/products/test-product'
    );
    expect(screen.getByRole('heading', { name: 'Test product' })).toBeInTheDocument();
    expect(screen.getByText('Core 5 · 8GB RAM · 256GB')).toBeInTheDocument();
  });
});
