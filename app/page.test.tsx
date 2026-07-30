import { render, screen } from '@testing-library/react';

import HomePage from './page';

describe('MozWired Store homepage', () => {
  it('renders only collections backed by the active inventory', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
    expect(screen.getAllByText('IdeaPad 1 15IAU7')).not.toHaveLength(0);
    expect(screen.getAllByText('Galaxy A57')).not.toHaveLength(0);
    expect(screen.getAllByText('Redmi A5')).not.toHaveLength(0);
    expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument();
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

    expect(storeHero).toContainElement(
      screen.getAllByText('IdeaPad 1 15IAU7').find((element) => storeHero?.contains(element)) ??
        null
    );
    expect(storeHero).not.toContainElement(screen.getAllByText('Galaxy A57')[0]);
  });

  it('hides the category rail when it is disabled in the store configuration', () => {
    render(<HomePage />);

    expect(
      screen.queryByRole('navigation', { name: 'Product categories' })
    ).not.toBeInTheDocument();
  });

  it('groups the smartphone collection over the section two background', () => {
    render(<HomePage />);

    const samsungSection = document.querySelector('#favorites');
    const background = document.querySelector('img[src*="store-section-2"]')?.parentElement;

    expect(background).toContainElement(samsungSection);
    expect(document.querySelector('#savings')).not.toBeInTheDocument();
    expect(background).not.toContainElement(document.querySelector('#benefits'));
  });

  it('does not render empty legacy collections or their background wrapper', () => {
    render(<HomePage />);

    expect(document.querySelector('#more-to-love')).not.toBeInTheDocument();
    expect(document.querySelector('#experience')).not.toBeInTheDocument();
    expect(document.querySelector('[data-section-background="footer"]')).not.toBeInTheDocument();
  });
});
