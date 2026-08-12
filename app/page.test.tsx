import { render, screen, within } from '@testing-library/react';

import HomePage from './page';

describe('MozWired Store homepage', () => {
  it('routes the hero catalogue action to the all-products page', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('link', { name: 'Shop all electronics ↗' })[0]).toHaveAttribute(
      'href',
      '/products'
    );
  });

  it('renders only collections backed by the active inventory', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
    expect(screen.getAllByText('IdeaPad 1')).not.toHaveLength(0);
    expect(screen.queryByText('IdeaPad 1 15IRU7')).not.toBeInTheDocument();
    expect(screen.getAllByText('Galaxy A57')).not.toHaveLength(0);
    expect(screen.getAllByText('A5')).not.toHaveLength(0);
    expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument();
  });

  it('does not present the catalog as managed IT services', () => {
    render(<HomePage />);

    expect(screen.queryByText('Managed devices')).not.toBeInTheDocument();
    expect(screen.queryByText('Cloud foundations')).not.toBeInTheDocument();
    expect(screen.queryByText('Structured networks')).not.toBeInTheDocument();
  });

  it('uses deliberate mobile hero wrapping and congruent collection headings', () => {
    render(<HomePage />);

    const partner = screen.getByText('Partner.');
    expect(partner).toHaveClass('block', 'w-fit', 'sm:ml-[0.12em]', 'sm:inline');
    expect(partner.parentElement).toHaveClass(
      'text-[clamp(2.5rem,12vw,3rem)]',
      'font-bold',
      'sm:text-[clamp(3rem,5vw,4rem)]'
    );

    const headings = Array.from(document.querySelectorAll('[data-collection-heading-content]'));
    expect(headings).toHaveLength(4);
    headings.forEach((heading) => {
      expect(heading).toHaveClass(
        'flex',
        'flex-wrap',
        'items-baseline',
        'gap-x-[0.25em]',
        'gap-y-1',
        'leading-tight'
      );
    });
  });

  it('aligns Accessories with full-bleed collection insets', () => {
    render(<HomePage />);

    const smartphonesSection = document.querySelector('#favorites');
    const accessoriesHeading = screen.getByRole('heading', {
      name: 'Accessories. The finishing touches for every setup.',
    });
    const accessoriesSection = accessoriesHeading.closest('section');
    const smartphonesCarousel = within(smartphonesSection as HTMLElement).getByRole('list');
    const accessoriesCarousel = within(accessoriesSection as HTMLElement).getByRole('list');

    expect(accessoriesHeading.parentElement).toHaveClass(
      'safe-page-padding',
      'mx-auto',
      'max-w-store'
    );
    expect(smartphonesCarousel).toHaveClass(
      'card-scroll-full-bleed',
      'card-scroll-content-window',
      'gap-3'
    );
    expect(accessoriesCarousel).toHaveClass(
      'card-scroll-full-bleed',
      'card-scroll-content-window',
      'gap-3'
    );
    expect(accessoriesCarousel.parentElement).toHaveClass('card-carousel-full-bleed', 'w-full');
  });

  it('renders one accessible catalogue link for every collection', () => {
    render(<HomePage />);

    const destinations = [
      ['View all computers', '/products?category=computers'],
      ['View all smartphones', '/products?category=phones'],
      ['View all accessories', '/products?category=accessories'],
      ['View all endless possibilities products', '/products?category=computers'],
    ];

    expect(document.querySelectorAll('[data-collection-view-all]')).toHaveLength(4);
    destinations.forEach(([name, href]) => {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('data-contrast', 'light');
      expect(link).toHaveClass('min-h-11', 'focus-ring', 'text-white/65', 'hover:text-white');
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });
  });

  it('uses a wrapping section-header row without absolute positioning or fixed width', () => {
    render(<HomePage />);

    document.querySelectorAll('[data-collection-header]').forEach((header) => {
      expect(header).toHaveClass('flex', 'flex-wrap', 'gap-y-2');
      expect(header.className).not.toContain('absolute');
      expect(header.className).not.toMatch(/\bw-screen\b/);
    });
  });

  it('renders the Endless possibilities cards with a consistent light tone', () => {
    render(<HomePage />);

    const possibilitiesSection = document.querySelector('#possibilities');
    const secondCardTitles = within(possibilitiesSection as HTMLElement).getAllByText(
      '290 G9 Pro Tower'
    );

    secondCardTitles.forEach((title) => {
      expect(title.closest('article')).toHaveClass('bg-white', 'text-store-ink');
      expect(title.closest('article')).not.toHaveClass('bg-[#151517]', 'text-white');
    });
  });

  it('extends the store hero background through the first product collection', () => {
    render(<HomePage />);

    const storeHero = document.querySelector('#store');

    expect(storeHero).toContainElement(
      screen.getAllByText('IdeaPad 1').find((element) => storeHero?.contains(element)) ?? null
    );
    expect(storeHero).not.toContainElement(screen.getAllByText('Galaxy A57')[0]);
  });

  it('hides the category rail when it is disabled in the store configuration', () => {
    render(<HomePage />);

    expect(
      screen.queryByRole('navigation', { name: 'Product categories' })
    ).not.toBeInTheDocument();
  });

  it('groups the smartphone and accessories collections over the section two background', () => {
    render(<HomePage />);

    const samsungSection = document.querySelector('#favorites');
    const accessoriesSection = document.querySelector('#accessories');
    const possibilitiesSection = document.querySelector('#possibilities');
    const background = document.querySelector('img[src*="store-section-2"]')?.parentElement;

    expect(background).toContainElement(samsungSection);
    expect(background).toContainElement(accessoriesSection);
    expect(background).not.toContainElement(possibilitiesSection);
    expect(document.querySelector('#savings')).not.toBeInTheDocument();
    expect(background).not.toContainElement(document.querySelector('#benefits'));
  });

  it('reuses the store hero background behind Endless possibilities', () => {
    render(<HomePage />);

    const possibilitiesSection = document.querySelector('#possibilities');
    const heroBackground = document.querySelector('[data-section-background="store-hero"]');
    const repeatedHeroImage = heroBackground?.querySelector('img[src*="store-hero-glow"]');
    const heading = within(possibilitiesSection as HTMLElement).getByRole('heading', {
      name: 'Endless possibilities. Technology for work, creativity, and play.',
    });

    expect(heroBackground).toContainElement(possibilitiesSection);
    expect(repeatedHeroImage).toBeInTheDocument();
    expect(heroBackground).toHaveClass('bg-[#08090a]');
    expect(heading).toHaveClass('text-white');
  });

  it('does not render empty legacy collections or their background wrapper', () => {
    render(<HomePage />);

    expect(document.querySelector('#more-to-love')).not.toBeInTheDocument();
    expect(document.querySelector('#experience')).not.toBeInTheDocument();
    expect(document.querySelector('[data-section-background="footer"]')).not.toBeInTheDocument();
  });
});
