import { fireEvent, render, screen, within } from '@testing-library/react';

import { catalogProducts } from '@/data/catalog';

import { Header } from './Header';

describe('Header', () => {
  it('renders the linked company logo and primary navigation', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: 'MozWired home' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get support' })).toBeInTheDocument();
  });

  it('provides accessible desktop mega-menu triggers and links', () => {
    render(<Header />);

    expect(screen.getByRole('button', { name: 'Computers' })).toHaveAttribute(
      'aria-haspopup',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Phones' })).toHaveAttribute('aria-haspopup', 'true');
    expect(screen.getByRole('button', { name: 'Mobile' })).toHaveAttribute('aria-haspopup', 'true');
    expect(screen.getByRole('button', { name: 'Audio' })).toHaveAttribute('aria-haspopup', 'true');
    expect(screen.getByRole('link', { name: /MacBook Pro/ })).toBeInTheDocument();
  });

  it('provides desktop navigation options only for curated catalog products', () => {
    render(<Header />);

    const productHrefs = new Set(
      Array.from(
        screen
          .getByRole('navigation', { name: 'Primary navigation' })
          .querySelectorAll<HTMLAnchorElement>('a[href^="/products/"]'),
        (link) => link.getAttribute('href')
      )
    );

    const featuredProducts = catalogProducts.filter(({ navigation }) => navigation.featured);
    expect(productHrefs.size).toBe(featuredProducts.length);
    featuredProducts.forEach(({ slug }) => {
      expect(productHrefs).toContain(`/products/${slug}`);
    });
  });

  it('opens and closes the mobile navigation', () => {
    render(<Header />);

    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    const mobileNavigation = screen.getByRole('navigation', { name: 'Mobile navigation' });
    expect(mobileNavigation).toBeInTheDocument();
    expect(
      within(mobileNavigation).getByRole('button', {
        name: 'Language, country and currency settings',
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText('Galaxy A57')).not.toHaveLength(0);
  });
});
