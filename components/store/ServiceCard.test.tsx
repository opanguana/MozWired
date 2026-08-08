import { render, screen } from '@testing-library/react';

import { mznPrice } from '@/types/money';

import { ServiceCard } from './ServiceCard';

describe('ServiceCard', () => {
  it('renders the OEM brand mark supplied by catalogue presentation data', () => {
    render(
      <ServiceCard
        card={{
          brand: 'Samsung',
          eyebrow: 'Made for the essentials',
          title: 'Galaxy A06',
          description: 'A practical smartphone for everyday use.',
          price: mznPrice(855_000),
        }}
      />
    );

    const mark = screen.getByRole('img', { name: 'Samsung brand' });
    expect(decodeURIComponent(mark.querySelector('img')?.getAttribute('src') ?? '')).toContain(
      '/images/brands/samsung.png'
    );
  });

  it('uses a readable brand-name fallback when an approved logo file is unavailable', () => {
    render(
      <ServiceCard
        card={{
          brand: 'HP',
          eyebrow: 'Configured for your needs',
          title: 'HP 15',
          description: 'A practical laptop for everyday use.',
          price: mznPrice(4_700_000),
        }}
      />
    );

    expect(screen.getByRole('img', { name: 'HP brand' })).toHaveTextContent('HP');
  });

  it('links the card to its dynamic product page', () => {
    render(
      <ServiceCard
        card={{
          eyebrow: 'Made for the essentials',
          title: 'Galaxy A06',
          description: 'A practical smartphone for everyday use.',
          price: mznPrice(700_000, 'from'),
        }}
      />
    );

    expect(screen.getByRole('link', { name: 'View Galaxy A06 details' })).toHaveAttribute(
      'href',
      '/products/galaxy-a06'
    );
  });

  it('keeps navigation stable when a merchandising title differs from the product slug', () => {
    render(
      <ServiceCard
        card={{
          href: '/products/targus-tbb565gl-74',
          eyebrow: 'Carry your technology',
          title: 'Targus Intellect',
          description: 'A practical laptop backpack.',
          price: mznPrice(320_000),
        }}
      />
    );

    expect(screen.getByRole('link', { name: 'View Targus Intellect details' })).toHaveAttribute(
      'href',
      '/products/targus-tbb565gl-74'
    );
  });

  it('keeps new, refurbished and promotion labels hidden while they are disabled', () => {
    render(
      <ServiceCard
        card={{
          eyebrow: 'Refurbished value',
          title: 'Redmi Note 7 Pro',
          description: 'A refurbished smartphone with 128GB of storage and 6GB of RAM.',
          price: mznPrice(620_000),
          condition: 'refurbished',
          promotion: true,
        }}
      />
    );

    expect(screen.queryByText('New')).not.toBeInTheDocument();
    expect(screen.queryByText('Refurbished')).not.toBeInTheDocument();
    expect(screen.queryByText('Promotion')).not.toBeInTheDocument();
  });

  it('uses a fixed product-media height without changing card dimensions', () => {
    render(
      <ServiceCard
        card={{
          eyebrow: 'Made for the essentials',
          title: 'Galaxy A06',
          description: 'A practical smartphone for everyday use.',
          price: mznPrice(855_000),
          image: '/images/products/samsung/galaxy-a06/main.png',
          category: 'phones',
        }}
      />
    );

    expect(screen.getByRole('article')).toHaveClass(
      'h-[31rem]',
      'min-h-[31rem]',
      'w-[18.5rem]',
      'md:w-[20rem]'
    );
    const image = screen.getByRole('img', { name: 'Galaxy A06' });
    expect(image).toHaveClass('object-contain', 'scale-[1.5]', 'group-hover:scale-[1.56]');
    expect(image.getAttribute('src')).toContain('main.png');
    expect(image.parentElement).toHaveClass('mt-auto', 'h-80', 'shrink-0', 'overflow-hidden');
    expect(image.parentElement).not.toHaveClass('flex-1', 'min-h-32', 'h-48', 'h-56');
  });

  it('preserves the laptop artwork scale used as the catalog reference', () => {
    render(
      <ServiceCard
        card={{
          eyebrow: 'Everyday performance',
          title: 'IdeaPad 1',
          description: 'A practical laptop for everyday work.',
          price: mznPrice(4_700_000),
          image: '/images/products/lenovo/ideapad-1-15iau7/main.png',
          category: 'computers',
        }}
      />
    );

    expect(screen.getByRole('img', { name: 'IdeaPad 1' })).toHaveClass(
      'object-contain',
      'scale-[0.92]',
      'group-hover:scale-[0.96]'
    );
  });

  it('keeps the same fixed outer height when optional metadata is present', () => {
    const { rerender } = render(
      <ServiceCard
        card={{
          eyebrow: 'Made for the essentials',
          title: 'Galaxy A06',
          description: 'A practical smartphone for everyday use.',
          price: mznPrice(855_000),
        }}
      />
    );

    expect(screen.getByRole('article')).toHaveClass('h-[31rem]');

    rerender(
      <ServiceCard
        card={{
          eyebrow: 'Made for the essentials',
          title: 'Galaxy A06',
          description: 'A practical smartphone for everyday use.',
          price: mznPrice(855_000),
          condition: 'new',
          promotion: true,
        }}
      />
    );

    expect(screen.getByRole('article')).toHaveClass('h-[31rem]');
    expect(screen.queryByText('New')).not.toBeInTheDocument();
    expect(screen.queryByText('Promotion')).not.toBeInTheDocument();
  });

  it('separates dark cards from dark section backgrounds', () => {
    render(
      <ServiceCard
        card={{
          eyebrow: 'Spatial computing',
          title: 'Apple Vision Pro',
          description: 'Experience entertainment, work, and connection in an entirely new way.',
          price: null,
          dark: true,
        }}
      />
    );

    expect(screen.getByRole('article')).toHaveClass('border-white/15', 'bg-[#151517]');
    expect(screen.getByRole('article')).not.toHaveClass('shadow-[0_18px_50px_rgb(0_0_0/0.35)]');
  });

  it('applies the warm charcoal treatment without changing card structure', () => {
    render(
      <ServiceCard
        card={{
          eyebrow: 'Connected entertainment',
          title: 'Apple TV',
          description: 'Stream entertainment and bring your connected home together.',
          price: null,
          warmDark: true,
        }}
      />
    );

    expect(screen.getByRole('article')).toHaveClass(
      'border-[#2a2821]',
      'bg-[#1b1a15]',
      'text-white'
    );
    expect(screen.getByRole('img', { name: /Apple TV product image coming soon/i })).toHaveClass(
      'bg-[#292720]',
      'text-[#d7d4cd]'
    );
  });
});
