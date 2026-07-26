'use client';

import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { label: 'Store', href: '#store' },
  { label: 'Networks', href: '#services' },
  { label: 'Cloud', href: '#cloud' },
  { label: 'Security', href: '#services' },
  { label: 'Devices', href: '#services' },
  { label: 'Web', href: '#cloud' },
  { label: 'Support', href: '#support' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <nav
        className="mx-auto flex h-11 max-w-store items-center justify-between px-5 lg:px-8"
        aria-label="Primary navigation"
      >
        <Link href="#store" aria-label="MozWired home" className="rounded-sm px-1 focus-ring">
          <Image
            src="/images/brand/mw-white.png"
            alt=""
            width={221}
            height={141}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="rounded-sm text-[11px] text-white/75 transition hover:text-white focus-ring"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button type="button" className="icon-button" aria-label="Search MozWired">
            <Search aria-hidden="true" size={15} strokeWidth={1.7} />
          </button>
          <button type="button" className="icon-button" aria-label="Open service bag">
            <ShoppingBag aria-hidden="true" size={15} strokeWidth={1.7} />
          </button>
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
          className="border-t border-white/15 px-5 py-4 md:hidden"
        >
          <ul className="grid gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-sm text-white/85 hover:bg-white/10 focus-ring"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="border-t border-white/10 bg-[#171719] px-5 py-3 text-center text-[11px] text-white/75">
        Build a safer, faster workplace with one technology partner.{' '}
        <Link href="#support" className="text-store-cyan hover:underline focus-ring">
          Talk to a specialist
        </Link>
      </div>
    </header>
  );
}
