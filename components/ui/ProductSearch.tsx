'use client';

import { Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useCurrency } from '@/components/currency/CurrencyProvider';
import { filterProductSearchIndex, type ProductSearchItem } from '@/catalog/search';
import { productSearchIndex } from '@/data/product-search';
import { formatProductPrice } from '@/lib/money';

const MAX_RESULTS = 8;

export function ProductSearch({ items = productSearchIndex }: { items?: ProductSearchItem[] }) {
  const router = useRouter();
  const { currency } = useCurrency();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(
    () => filterProductSearchIndex(items, query).slice(0, MAX_RESULTS),
    [items, query]
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href]'
        )
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const closeSearch = (restoreFocus = true) => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (results.length ? (current + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) =>
        results.length ? (current - 1 + results.length) % results.length : 0
      );
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      const selected = results[activeIndex];
      closeSearch(false);
      router.push(`/products/${selected.slug}`);
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closeSearch();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="icon-button"
        aria-label="Search products"
        aria-expanded={open}
        aria-controls="product-search-dialog"
        onClick={() => (open ? closeSearch() : setOpen(true))}
      >
        <Search aria-hidden="true" size={15} strokeWidth={1.7} />
      </button>

      {open && (
        <div
          className="safe-overlay-padding fixed inset-0 z-[80] flex items-start justify-center overflow-x-hidden bg-black/65"
          onMouseDown={handleBackdropClick}
        >
          <div
            ref={dialogRef}
            id="product-search-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-search-title"
            className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c0d]/95 text-white shadow-[0_24px_80px_rgb(0_0_0/0.65)]"
          >
            <h2 id="product-search-title" className="sr-only">
              Search MozWired products
            </h2>
            <div className="flex h-14 items-center gap-3 border-b border-white/10 px-4">
              <Search aria-hidden="true" className="shrink-0 text-white/40" size={18} />
              <label htmlFor="product-search-input" className="sr-only">
                Search products
              </label>
              <input
                ref={inputRef}
                id="product-search-input"
                type="search"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="product-search-results"
                aria-expanded="true"
                aria-activedescendant={results[activeIndex] ? `product-search-${activeIndex}` : undefined}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search products"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
              <button
                type="button"
                aria-label="Close product search"
                className="focus-ring inline-flex size-11 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
                onClick={() => closeSearch()}
              >
                <X aria-hidden="true" size={17} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {results.length ? (
                <ul id="product-search-results" role="listbox" aria-label="Product results">
                  {results.map((item, index) => {
                    const formattedPrice = formatProductPrice(item.price, currency).text;
                    return (
                      <li key={item.slug} role="presentation">
                        <Link
                          id={`product-search-${index}`}
                          role="option"
                          aria-selected={index === activeIndex}
                          href={`/products/${item.slug}`}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => closeSearch(false)}
                          className={`focus-ring grid min-h-20 grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3 rounded-xl px-3 py-2 transition sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] ${
                            index === activeIndex ? 'bg-white/10' : 'hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="relative block size-14 overflow-hidden rounded-lg bg-white/90">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt=""
                                fill
                                sizes="56px"
                                className="object-contain"
                              />
                            ) : (
                              <Search
                                aria-hidden="true"
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black/25"
                                size={20}
                              />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{item.title}</span>
                            <span className="mt-1 block text-[11px] capitalize text-white/45">
                              {item.brand} · {item.category}
                            </span>
                            <span className="mt-1 block text-[11px] text-white/60 sm:hidden">
                              {formattedPrice}
                            </span>
                          </span>
                          <span className="hidden shrink-0 text-xs font-medium text-white/65 sm:block">
                            {formattedPrice}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="px-4 py-12 text-center text-sm text-white/50">
                  No products match “{query.trim()}”.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
