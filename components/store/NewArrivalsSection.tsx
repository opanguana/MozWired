'use client';

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { ProductPrice } from '@/components/currency/ProductPrice';
import type { NewArrivalCardData } from '@/data/new-arrivals';
import { cn } from '@/lib/utils';

export function NewArrivalsSection({ cards }: { cards: NewArrivalCardData[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const firstCard = scroller.firstElementChild as HTMLElement | null;
    const secondCard = firstCard?.nextElementSibling as HTMLElement | null;
    const stride = firstCard && secondCard ? secondCard.offsetLeft - firstCard.offsetLeft : 236;
    const visibleCards = Math.max(1, Math.floor(scroller.clientWidth / stride));

    scroller.scrollBy({
      left: direction * stride * visibleCards,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section
      id="new-arrivals"
      aria-labelledby="new-arrivals-title"
      className="bg-[#f5f5f7] py-10 text-store-ink md:py-14"
    >
      <div className="safe-page-padding mx-auto flex max-w-store items-center justify-between gap-6">
        <h2 id="new-arrivals-title" className="text-2xl font-bold tracking-[-0.035em] md:text-3xl">
          New arrivals
        </h2>
        <Link
          href="#favorites"
          className="focus-ring inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-medium text-black/65 transition hover:text-black"
        >
          View all <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      <div className="card-carousel-full-bleed relative mt-5 w-full">
        <div
          ref={scrollerRef}
          role="list"
          aria-label="New arrivals"
          className="card-scroll card-scroll-full-bleed flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4"
        >
          {cards.map((card) => (
            <article
              key={card.href}
              role="listitem"
              className="group relative flex h-[21rem] w-56 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-black/[0.035] bg-white/75 p-3.5"
            >
              <Link
                href={card.href ?? '#'}
                aria-label={`View ${card.title} details`}
                className="focus-ring absolute inset-0 z-10 rounded-xl"
              />
              <span className="absolute left-3.5 top-3.5 z-[1] rounded-full bg-black/[0.055] px-2 py-1 text-[9px] font-bold tracking-[0.08em] text-black/65">
                NEW
              </span>

              <div className="relative h-52 shrink-0 overflow-hidden" aria-hidden={!card.image}>
                {card.image && (
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="224px"
                    className={cn(
                      'object-contain transition-transform duration-300',
                      card.brand === 'Redmi'
                        ? 'scale-[0.8] group-hover:scale-[0.84]'
                        : 'scale-[1.25] group-hover:scale-[1.3]'
                    )}
                  />
                )}
              </div>

              <div className="mt-auto min-h-[5.75rem]">
                <h3 className="line-clamp-2 text-[15px] font-semibold leading-[1.15] tracking-[-0.02em]">
                  {card.title}
                </h3>
                {card.specification && (
                  <p className="mt-1 truncate text-[11px] text-black/45">{card.specification}</p>
                )}
                <ProductPrice
                  price={card.price}
                  showVat={false}
                  className="mt-2 text-xs font-medium text-black/75"
                />
              </div>
            </article>
          ))}
        </div>

        {cards.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Show previous new arrivals"
              onClick={() => move(-1)}
              className="card-carousel-control-start focus-ring absolute top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/95 text-black/60 shadow-sm transition hover:text-black md:flex"
            >
              <ChevronLeft aria-hidden="true" size={22} />
            </button>
            <button
              type="button"
              aria-label="Show next new arrivals"
              onClick={() => move(1)}
              className="card-carousel-control-end focus-ring absolute top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white/95 text-black/60 shadow-sm transition hover:text-black md:flex"
            >
              <ChevronRight aria-hidden="true" size={22} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
