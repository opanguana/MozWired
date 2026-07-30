import { render, screen } from '@testing-library/react';

import ProductPage, { generateStaticParams } from './page';

describe('dynamic product page', () => {
  it('renders supplied smartphone variants for the selected product', async () => {
    render(await ProductPage({ params: Promise.resolve({ slug: 'galaxy-a06' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Buy Galaxy A06' })).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: 'Galaxy A06 available configurations' })
    ).toBeInTheDocument();
    expect(screen.getByText('64GB · 4GB RAM · 4G')).toBeInTheDocument();
    expect(screen.getAllByText(/8,550/)).not.toHaveLength(0);
    expect(screen.getByRole('link', { name: '← Back to the store' })).toHaveAttribute('href', '/');
  });

  it('prebuilds a route for every catalog product', () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([{ slug: 'galaxy-a06' }, { slug: 'thinkpad-x1-carbon-gen-13' }])
    );
    expect(generateStaticParams()).not.toContainEqual({ slug: 'macbook-air' });
  });
});
