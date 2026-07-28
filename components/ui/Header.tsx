'use client';

import { ArrowUpRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { CurrencySelector } from '@/components/currency/CurrencySelector';
import { siteAnnouncement } from '@/config/announcement';
import { catalogProducts, type CatalogProduct } from '@/data/catalog';
import { cn } from '@/lib/utils';

import { AnnouncementBanner } from './AnnouncementBanner';

type NavItem = {
  label: string;
  href: string;
  featured?: boolean;
  wide?: boolean;
  children?: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }[];
};

function productLinks(products: CatalogProduct[]): NonNullable<NavItem['children']> {
  return products.map(({ card, slug }) => ({
    eyebrow: card.eyebrow,
    title: card.title,
    description: card.description,
    href: `/products/${slug}`,
  }));
}

const productGroups = {
  computers: catalogProducts.filter(({ card }) =>
    ['MacBook Air', 'MacBook Pro', 'iMac', 'Mac mini'].includes(card.title)
  ),
  phones: catalogProducts.filter(
    ({ brand, card }) => Boolean(brand) || card.title.startsWith('iPhone')
  ),
  mobile: catalogProducts.filter(
    ({ card }) =>
      card.title.startsWith('iPad') ||
      card.title.startsWith('Apple Watch') ||
      card.title === 'Apple Vision Pro'
  ),
  audio: catalogProducts.filter(({ card }) =>
    ['AirPods Pro', 'AirPods', 'HomePod', 'Apple TV 4K'].includes(card.title)
  ),
  accessories: catalogProducts.filter(({ card }) =>
    ['AirTag', 'Cases and bands', 'Gift Card'].includes(card.title)
  ),
};

const navItems: NavItem[] = [
  { label: 'Store', href: '/#store', featured: true },
  {
    label: 'Computers',
    href: '/#services',
    children: productLinks(productGroups.computers),
  },
  {
    label: 'Phones',
    href: '/#favorites',
    wide: true,
    children: productLinks(productGroups.phones),
  },
  {
    label: 'Mobile',
    href: '/#possibilities',
    children: productLinks(productGroups.mobile),
  },
  {
    label: 'Audio',
    href: '/#accessories',
    children: productLinks(productGroups.audio),
  },
  {
    label: 'Accessories',
    href: '/#accessories',
    children: productLinks(productGroups.accessories),
  },
  { label: 'Deals', href: '/#savings' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-white/10 bg-black text-white">
      <nav
        className="relative mx-auto grid h-14 max-w-store grid-cols-[1fr_auto_1fr] items-center px-5 lg:px-8"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          aria-label="MozWired home"
          className="justify-self-start rounded-sm px-1 focus-ring"
        >
          <Image
            src="/images/brand/mw-white.png"
            alt=""
            width={221}
            height={141}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <li key={item.label} className="group relative">
              {item.children ? (
                <button
                  type="button"
                  aria-haspopup="true"
                  className="nav-pill"
                  data-testid={`${item.label.toLowerCase()}-menu-trigger`}
                >
                  {item.label}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-3 opacity-50 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={item.featured ? 'nav-pill nav-pill-active' : 'nav-pill'}
                >
                  {item.label}
                </Link>
              )}

              {item.children && (
                <div className={cn('nav-mega-panel', item.wide && 'nav-mega-panel-wide')}>
                  <div
                    className={cn('nav-mega-grid grid grid-cols-3', item.wide && 'lg:grid-cols-4')}
                  >
                    {item.children.map((child) => (
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
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-self-end gap-1.5">
          <CurrencySelector />
          <button type="button" className="icon-button" aria-label="Search MozWired">
            <Search aria-hidden="true" size={15} strokeWidth={1.7} />
          </button>
          <Link
            href="/#support"
            className="hidden min-h-8 items-center rounded-full bg-white px-4 text-[13px] font-semibold text-black transition hover:bg-store-cyan focus-ring sm:inline-flex"
          >
            Get support
          </Link>
          <button
            type="button"
            className="icon-button md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-[#090a0a] px-5 py-4 md:hidden"
        >
          <ul className="grid gap-1">
            {([...navItems, { label: 'Support', href: '/#support' }] as NavItem[]).map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <details className="group/mobile">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white focus-ring">
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className="size-4 transition-transform group-open/mobile:rotate-180"
                      />
                    </summary>
                    <ul className="grid gap-1 pb-2 pl-3">
                      {item.children.map((child) => (
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
                    </ul>
                  </details>
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
        </nav>
      )}

      <AnnouncementBanner announcement={siteAnnouncement} />
    </header>
  );
}
