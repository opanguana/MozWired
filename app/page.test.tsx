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

    expect(storeHero).toContainElement(
      screen.getAllByText('MacBook Pro').find((element) => storeHero?.contains(element)) ?? null
    );
    expect(storeHero).not.toContainElement(screen.getAllByText('Galaxy A57')[0]);
  });

  it('hides the category rail when it is disabled in the store configuration', () => {
    render(<HomePage />);

    expect(
      screen.queryByRole('navigation', { name: 'Product categories' })
    ).not.toBeInTheDocument();
  });

  it('groups the Samsung and savings collections over the section two background', () => {
    render(<HomePage />);

    const samsungSection = document.querySelector('#favorites');
    const savingsSection = document.querySelector('#savings');
    const background = document.querySelector('img[src*="store-section-2"]')?.parentElement;

    expect(background).toContainElement(samsungSection);
    expect(background).toContainElement(savingsSection);
    expect(background).not.toContainElement(document.querySelector('#benefits'));
  });

  it('groups the final iPhone and experience collections over the footer background', () => {
    render(<HomePage />);

    const background = document.querySelector('[data-section-background="footer"]');

    expect(background).toContainElement(document.querySelector('#more-to-love'));
    expect(background).toContainElement(document.querySelector('#experience'));
    expect(background).not.toContainElement(document.querySelector('#possibilities'));
  });

  it('uses one warm dark card treatment across the MozWired experience collection', () => {
    render(<HomePage />);

    const experienceCards = document.querySelectorAll('#experience article');

    expect(experienceCards).toHaveLength(4);
    experienceCards.forEach((card) => {
      expect(card).toHaveClass('bg-[#1b1a15]', 'border-[#2a2821]');
    });
  });
});
