import { render, screen } from '@testing-library/react';

import { ServiceCard } from './ServiceCard';

describe('ServiceCard', () => {
  it('links the card to its dynamic product page', () => {
    render(
      <ServiceCard
        card={{
          eyebrow: 'Made for the essentials',
          title: 'Galaxy A06',
          description: 'A practical smartphone for everyday use.',
          price: 'From 7,000 MZN',
        }}
      />
    );

    expect(screen.getByRole('link', { name: 'View Galaxy A06 details' })).toHaveAttribute(
      'href',
      '/products/galaxy-a06'
    );
  });
});
