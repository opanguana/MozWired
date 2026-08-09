import { fireEvent, render, screen, within } from '@testing-library/react';

import { catalogProducts } from '@/data/catalog';

import { Header } from './Header';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Header', () => {
  it('renders the linked company logo and primary navigation', () => {
    render(<Header />);

    const homeLink = screen.getByRole('link', { name: 'MozWired home' });
    expect(homeLink).not.toHaveClass('px-1');
    expect(homeLink).toHaveClass(
      'inline-flex',
      'size-11',
      'items-center',
      'justify-center',
      'lg:size-auto',
      'lg:justify-start'
    );
    expect(homeLink.querySelector('img')).toHaveClass('h-5', 'w-auto');
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toHaveClass(
      'grid-cols-[auto_1fr]',
      'lg:grid-cols-[1fr_auto_1fr]'
    );
    expect(screen.getByRole('link', { name: 'Get support' })).toHaveClass(
      'min-h-8',
      'px-3',
      'text-xs'
    );
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toHaveClass(
      'safe-page-padding'
    );
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveClass(
      'icon-button',
      'lg:hidden'
    );
    const headerActions = screen.getByTestId('header-actions');
    expect(headerActions).toHaveClass('gap-1', 'sm:gap-1.5');
    expect(screen.getByRole('button', { name: 'Search products' })).toHaveClass('icon-button');
    expect(screen.getByTestId('mobile-menu-icon-wrap')).toHaveClass('inline-flex');
    expect(screen.getByTestId('mobile-menu-icon-wrap')).not.toHaveClass('ml-auto');
  });

  it('provides accessible desktop mega-menu triggers and links', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: 'Computers' })).toHaveAttribute(
      'href',
      '/products?category=computers'
    );
    expect(screen.getByRole('link', { name: 'Phones' })).toHaveAttribute(
      'href',
      '/products?category=phones'
    );
    expect(screen.queryByRole('link', { name: 'Mobile' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Audio' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View all computers' })).toHaveAttribute(
      'href',
      '/products?category=computers'
    );
    expect(screen.getByRole('link', { name: /ThinkPad X1 Carbon Gen 13/ })).toBeInTheDocument();
  });

  it('keeps every published catalog category reachable from primary navigation', () => {
    render(<Header />);
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' });
    const expectedCategoryLinks = new Map([
      ['computers', '/products?category=computers'],
      ['phones', '/products?category=phones'],
      ['accessories', '/products?category=accessories'],
      ['mobile', '/products?category=mobile'],
      ['audio', '/products?category=audio'],
    ]);

    new Set(catalogProducts.map(({ category }) => category)).forEach((category) => {
      expect(
        within(navigation).getByRole('link', {
          name: new RegExp(`^${category === 'phones' ? 'Phones' : category}$`, 'i'),
        })
      ).toHaveAttribute('href', expectedCategoryLinks.get(category));
    });
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
    expect(mobileNavigation).toHaveClass('safe-page-padding', 'lg:hidden');
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveClass('lg:hidden');
    expect(
      within(mobileNavigation).getByRole('button', {
        name: 'Language, country and currency settings',
      })
    ).toBeInTheDocument();
    const computersLink = within(mobileNavigation).getByRole('link', { name: 'Computers' });
    expect(computersLink).toHaveAttribute('href', '/products?category=computers');
    const showComputers = within(mobileNavigation).getByRole('button', {
      name: 'Show Computers featured products',
    });
    fireEvent.click(showComputers);
    expect(showComputers).toHaveAttribute('aria-expanded', 'true');
    expect(
      within(mobileNavigation).getByText('Dell Alienware 16X Aurora AC16251')
    ).toBeInTheDocument();
    expect(
      within(mobileNavigation).getByRole('link', { name: 'View all computers' })
    ).toHaveAttribute('href', '/products?category=computers');
  });
});
