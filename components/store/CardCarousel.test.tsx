import { render, screen } from '@testing-library/react';

import type { ServiceCardData } from './ServiceCard';
import { CardCarousel } from './CardCarousel';

const cards: ServiceCardData[] = Array.from({ length: 5 }, (_, index) => ({
  eyebrow: `Product ${index + 1}`,
  title: `Device ${index + 1}`,
  description: 'A concise product description.',
  price: `${index + 1},000 MZN`,
}));

describe('CardCarousel', () => {
  it('adds gallery controls when a collection contains more than four cards', () => {
    render(<CardCarousel cards={cards} label="Featured devices" fullBleed />);

    expect(
      screen.getByRole('button', { name: 'Show previous products in Featured devices' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Show next products in Featured devices' })
    ).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Featured devices' }).parentElement).toHaveClass(
      'w-full'
    );
    expect(screen.getByRole('list', { name: 'Featured devices' })).toHaveClass(
      'card-scroll-full-bleed'
    );
  });

  it('keeps four-card collections as a scrollable rail without gallery controls', () => {
    render(<CardCarousel cards={cards.slice(0, 4)} label="Featured devices" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Featured devices' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Featured devices' }).parentElement).toHaveClass(
      'max-w-store'
    );
    expect(screen.getByRole('list', { name: 'Featured devices' })).not.toHaveClass(
      'card-scroll-full-bleed'
    );
  });
});
