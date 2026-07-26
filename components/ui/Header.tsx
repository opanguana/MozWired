'use client';

import { ArrowUpRight, ChevronDown, Menu, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { siteAnnouncement } from '@/config/announcement';

import { AnnouncementBanner } from './AnnouncementBanner';

type NavItem = {
  label: string;
  href: string;
  featured?: boolean;
  children?: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }[];
};

const navItems: NavItem[] = [
  { label: 'Store', href: '#store', featured: true },
  {
    label: 'Networks',
    href: '#services',
    children: [
      {
        eyebrow: 'Plan',
        title: 'Network design',
        description: 'Build reliable foundations for every site.',
        href: '#services',
      },
      {
        eyebrow: 'Build',
        title: 'Structured cabling',
        description: 'Connect teams with tidy, scalable infrastructure.',
        href: '#services',
      },
      {
        eyebrow: 'Operate',
        title: 'Managed networks',
        description: 'Keep performance visible and interruptions low.',
        href: '#support',
      },
    ],
  },
  {
    label: 'Cloud',
    href: '#cloud',
    children: [
      {
        eyebrow: 'Move',
        title: 'Data migration',
        description: 'Transfer mail and files with a clear rollout plan.',
        href: '#cloud',
      },
      {
        eyebrow: 'Modernize',
        title: 'Microsoft 365',
        description: 'Give every team a secure place to collaborate.',
        href: '#cloud',
      },
      {
        eyebrow: 'Scale',
        title: 'Cloud foundations',
        description: 'Create a platform that can grow without sprawl.',
        href: '#cloud',
      },
    ],
  },
  {
    label: 'Security',
    href: '#services',
    children: [
      {
        eyebrow: 'Identity',
        title: 'Access protection',
        description: 'Make sign-in simpler for teams and harder to abuse.',
        href: '#services',
      },
      {
        eyebrow: 'Devices',
        title: 'Endpoint management',
        description: 'Apply consistent controls across every device.',
        href: '#services',
      },
      {
        eyebrow: 'Assurance',
        title: 'Security reviews',
        description: 'Find practical improvements before incidents do.',
        href: '#support',
      },
    ],
  },
  { label: 'Devices', href: '#services' },
  { label: 'Web', href: '#cloud' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black text-white">
      <nav
        className="relative mx-auto grid h-14 max-w-store grid-cols-[1fr_auto_1fr] items-center px-5 lg:px-8"
        aria-label="Primary navigation"
      >
        <Link
          href="#store"
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
                <div className="nav-mega-panel">
                  <div className="grid grid-cols-3 gap-1 p-1.5">
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
                        <span className="mt-1 text-[10px] leading-relaxed text-white/45">
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
          <button type="button" className="icon-button" aria-label="Search MozWired">
            <Search aria-hidden="true" size={15} strokeWidth={1.7} />
          </button>
          <Link
            href="#support"
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
            {[...navItems, { label: 'Support', href: '#support' }].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-3 py-3 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white focus-ring"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <AnnouncementBanner announcement={siteAnnouncement} />
    </header>
  );
}
