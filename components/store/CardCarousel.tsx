'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { ServiceCard, type ServiceCardData } from './ServiceCard';

export function CardCarousel({
  cards,
  label,
  fullBleed = false,
}: {
  cards: ServiceCardData[];
  label: string;
  fullBleed?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hasCarouselControls = cards.length > 4;
  const [canScrollBackward, setCanScrollBackward] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(hasCarouselControls);

  const updateControls = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !hasCarouselControls) return;

    const endPosition = scroller.scrollWidth - scroller.clientWidth;
    setCanScrollBackward(scroller.scrollLeft > 2);
    setCanScrollForward(scroller.scrollLeft < endPosition - 2);
  }, [hasCarouselControls]);

  useEffect(() => {
    updateControls();
    window.addEventListener('resize', updateControls);

    const scroller = scrollerRef.current;
    const resizeObserver =
      scroller && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateControls)
        : undefined;

    if (scroller) resizeObserver?.observe(scroller);

    return () => {
      window.removeEventListener('resize', updateControls);
      resizeObserver?.disconnect();
    };
  }, [updateControls]);

  const move = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.85, 296),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className={cn('relative mt-5', fullBleed ? 'w-full' : 'mx-auto max-w-store')}>
      <div
        ref={scrollerRef}
        className={cn(
          'card-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto pb-5',
          fullBleed ? 'card-scroll-full-bleed' : 'px-5 md:px-8'
        )}
        role="list"
        aria-label={label}
        onScroll={updateControls}
      >
        {cards.map((card) => (
          <div key={card.title} role="listitem">
            <ServiceCard card={card} />
          </div>
        ))}
      </div>

      {hasCarouselControls && (
        <>
          <button
            type="button"
            aria-label={`Show previous products in ${label}`}
            disabled={!canScrollBackward}
            onClick={() => move(-1)}
            className={cn(
              'focus-ring absolute left-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e2e5]/95 text-black/60 shadow-sm backdrop-blur transition hover:bg-[#d7d7da] hover:text-black md:flex',
              !canScrollBackward && 'invisible'
            )}
          >
            <ChevronLeft aria-hidden="true" size={24} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label={`Show next products in ${label}`}
            disabled={!canScrollForward}
            onClick={() => move(1)}
            className={cn(
              'focus-ring absolute right-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e2e5]/95 text-black/60 shadow-sm backdrop-blur transition hover:bg-[#d7d7da] hover:text-black md:flex',
              !canScrollForward && 'invisible'
            )}
          >
            <ChevronRight aria-hidden="true" size={24} strokeWidth={2.4} />
          </button>
        </>
      )}
    </div>
  );
}
