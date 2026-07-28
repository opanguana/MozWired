import { render, screen } from '@testing-library/react';

import { mznPrice } from '@/types/money';

import { ServiceCard } from './ServiceCard';

describe('ServiceCard', () => {
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

    expect(screen.getByRole('article')).toHaveClass(
      'border-white/15',
      'bg-[#151517]',
      'shadow-[0_18px_50px_rgb(0_0_0/0.35)]'
    );
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
