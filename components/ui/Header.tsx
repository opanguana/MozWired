'use client';

import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { LocalePreferencesControl } from '@/components/currency/LocalePreferencesControl';
import { siteAnnouncement } from '@/config/announcement';
import type { CatalogCategory } from '@/catalog/schema';
import { catalogProducts, type CatalogProduct } from '@/data/catalog';
import { cn } from '@/lib/utils';

import { AnnouncementBanner } from './AnnouncementBanner';
import { ProductSearch } from './ProductSearch';

type NavItem = {
  label: string;
  href: string;
  category?: CatalogCategory;
  featured?: boolean;
  wide?: boolean;
  children?: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }[];
};

const categoryNavigation: Record<CatalogCategory, { label: string; href: string; wide?: boolean }> =
  {
    computers: { label: 'Computers', href: '/#services' },
    phones: { label: 'Phones', href: '/#favorites', wide: true },
    accessories: { label: 'Accessories', href: '/#accessories' },
    mobile: { label: 'Mobile', href: '/#possibilities' },
    audio: { label: 'Audio', href: '/#possibilities' },
  };

function productLinks(products: CatalogProduct[]): NonNullable<NavItem['children']> {
  return products
    .filter(({ navigation }) => navigation.featured)
    .sort(
      (left, right) =>
        (left.navigation.order ?? Number.MAX_SAFE_INTEGER) -
        (right.navigation.order ?? Number.MAX_SAFE_INTEGER)
    )
    .map(({ brand, card, slug }) => ({
      eyebrow: card.eyebrow,
      title: `${brand} ${card.title}`,
      description: card.description,
      href: `/products/${slug}`,
    }));
}

const publishedCategories = Array.from(new Set(catalogProducts.map(({ category }) => category)));

const navItems: NavItem[] = [
  { label: 'Store', href: '/#store', featured: true },
  ...publishedCategories.map((category) => {
    const navigation = categoryNavigation[category];
    return {
      ...navigation,
      category,
      children: productLinks(catalogProducts.filter((product) => product.category === category)),
    };
  }),
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);

  return (
    <header className="relative z-50 border-b border-white/10 bg-black text-white">
      <nav
        className="safe-page-padding relative mx-auto grid h-14 max-w-store grid-cols-[auto_1fr] items-center lg:grid-cols-[1fr_auto_1fr]"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          aria-label="MozWired home"
          className="inline-flex size-11 items-center justify-center justify-self-start rounded-sm focus-ring lg:size-auto lg:justify-start"
        >
          <Image
            src="/images/brand/mw-white.png"
            alt=""
            width={221}
            height={141}
            priority
            className="h-5 w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <li key={item.label} className="group relative">
              {item.category ? (
                <Link
                  href={item.href}
                  className="nav-pill"
                  data-testid={`${item.label.toLowerCase()}-menu-trigger`}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-3 opacity-50 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                  />
                </Link>
              ) : (
                <Link
                  href={item.href}
                  className={item.featured ? 'nav-pill nav-pill-active' : 'nav-pill'}
                >
                  {item.label}
                </Link>
              )}

              {item.category && (
                <div className={cn('nav-mega-panel', item.wide && 'nav-mega-panel-wide')}>
                  <div
                    className={cn('nav-mega-grid grid grid-cols-3', item.wide && 'lg:grid-cols-4')}
                  >
                    {item.children?.map((child) => (
                      <Link key={child.title} href={child.href} className="nav-mega-item">
                        <span className="text-[10px] text-white/35">{child.eyebrow}</span>
                        <span className="mt-2 flex items-center justify-between gap-2 text-xs font-medium text-white/90">
                          {child.title}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-3 opacity-0 transition-opacity group-hover:opacity-50"
                          />
                        </span>
                        <span className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-white/45">
                          {child.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={item.href}
                    className="focus-ring flex min-h-12 items-center justify-between border-t border-white/10 px-4 text-xs font-semibold text-white/75 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    View all {item.label.toLowerCase()}
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div
          className="flex items-center justify-self-end gap-1 sm:gap-1.5"
          data-testid="header-actions"
        >
          <div className="hidden lg:block">
            <LocalePreferencesControl />
          </div>
          <ProductSearch />
          <Link
            href="/#support"
            className="hidden min-h-8 items-center rounded-full bg-white px-3 text-xs font-semibold text-black transition hover:bg-store-cyan focus-ring sm:inline-flex"
          >
            Get support
          </Link>
          <button
            type="button"
            className="icon-button lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="inline-flex" data-testid="mobile-menu-icon-wrap">
              {menuOpen ? (
                <X aria-hidden="true" size={18} />
              ) : (
                <Menu aria-hidden="true" size={18} />
              )}
            </span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="safe-page-padding border-t border-white/10 bg-[#090a0a] py-4 lg:hidden"
        >
          <ul className="grid gap-1">
            {([...navItems, { label: 'Support', href: '/#support' }] as NavItem[]).map((item) => (
              <li key={item.label}>
                {item.category ? (
                  <div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={item.href}
                        className="focus-ring flex min-h-11 flex-1 items-center rounded-xl px-3 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        className="focus-ring flex size-11 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                        aria-label={`${mobileCategoryOpen === item.label ? 'Hide' : 'Show'} ${item.label} featured products`}
                        aria-expanded={mobileCategoryOpen === item.label}
                        aria-controls={`mobile-${item.label.toLowerCase()}-products`}
                        onClick={() =>
                          setMobileCategoryOpen((current) =>
                            current === item.label ? null : item.label
                          )
                        }
                      >
                        <ChevronDown
                          aria-hidden="true"
                          className={cn(
                            'size-4 transition-transform',
                            mobileCategoryOpen === item.label && 'rotate-180'
                          )}
                        />
                      </button>
                    </div>
                    {mobileCategoryOpen === item.label && (
                      <ul
                        id={`mobile-${item.label.toLowerCase()}-products`}
                        className="grid gap-1 pb-2 pl-3"
                      >
                        {item.children?.map((child) => (
                          <li key={child.title}>
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2 text-xs text-white/55 transition hover:bg-white/[0.06] hover:text-white focus-ring"
                              onClick={() => setMenuOpen(false)}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href={item.href}
                            className="block rounded-lg px-3 py-2 text-xs font-semibold text-store-cyan transition hover:bg-white/[0.06] focus-ring"
                            onClick={() => setMenuOpen(false)}
                          >
                            View all {item.label.toLowerCase()}
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-xl px-3 py-3 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white focus-ring"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-white/10 pt-4">
            <LocalePreferencesControl compact />
          </div>
        </nav>
      )}

      <AnnouncementBanner announcement={siteAnnouncement} />
    </header>
  );
}
