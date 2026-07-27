import { render, screen } from '@testing-library/react';

import HomePage from './page';

describe('MozWired Store homepage', () => {
  it('renders eight electronics merchandising sections', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(8);
    expect(screen.getAllByText('MacBook Pro')).not.toHaveLength(0);
    expect(screen.getAllByText('Galaxy A57')).not.toHaveLength(0);
    expect(screen.getAllByText('iPhone 15 Pro Max')).not.toHaveLength(0);
  });

  it('does not present the catalog as managed IT services', () => {
    render(<HomePage />);

    expect(screen.queryByText('Managed devices')).not.toBeInTheDocument();
    expect(screen.queryByText('Cloud foundations')).not.toBeInTheDocument();
    expect(screen.queryByText('Structured networks')).not.toBeInTheDocument();
  });

  it('extends the store hero background through the first product collection', () => {
    render(<HomePage />);

    const storeHero = document.querySelector('#store');

    expect(storeHero).toContainElement(screen.getByText('MacBook Pro'));
    expect(storeHero).not.toContainElement(screen.getAllByText('Galaxy A57')[0]);
  });

  it('hides the category rail when it is disabled in the store configuration', () => {
    render(<HomePage />);

    expect(
      screen.queryByRole('navigation', { name: 'Product categories' })
    ).not.toBeInTheDocument();
  });
});
