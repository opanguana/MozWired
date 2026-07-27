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
  const leadingSetRef = useRef<HTMLDivElement>(null);
  const accessibleSetRef = useRef<HTMLDivElement>(null);
  const hasCarouselControls = cards.length > 4;
  const [hasInteracted, setHasInteracted] = useState(false);
  const cardSets = hasCarouselControls ? [0, 1, 2] : [1];

  const maintainLoop = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !hasCarouselControls) return;

    const leadingStart = leadingSetRef.current?.offsetLeft;
    const accessibleStart = accessibleSetRef.current?.offsetLeft;
    if (leadingStart === undefined || accessibleStart === undefined) return;

    const setWidth = accessibleStart - leadingStart;
    if (setWidth <= 0) return;

    if (scroller.scrollLeft < setWidth * 0.5) {
      scroller.scrollLeft += setWidth;
    } else if (scroller.scrollLeft > setWidth * 1.5) {
      scroller.scrollLeft -= setWidth;
    }
  }, [hasCarouselControls]);

  useEffect(() => {
    maintainLoop();
    window.addEventListener('resize', maintainLoop);

    const scroller = scrollerRef.current;
    const resizeObserver =
      scroller && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(maintainLoop)
        : undefined;

    if (scroller) resizeObserver?.observe(scroller);

    return () => {
      window.removeEventListener('resize', maintainLoop);
      resizeObserver?.disconnect();
    };
  }, [maintainLoop]);

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
          fullBleed ? 'card-scroll-full-bleed' : 'px-5 md:px-8',
          fullBleed && hasCarouselControls && !hasInteracted && 'card-scroll-awaiting-interaction'
        )}
        role="list"
        aria-label={label}
        onScroll={maintainLoop}
        onPointerDown={() => setHasInteracted(true)}
        onWheel={() => setHasInteracted(true)}
        onKeyDown={() => setHasInteracted(true)}
      >
        {cardSets.flatMap((copyIndex) =>
          cards.map((card, cardIndex) => {
            const accessible = copyIndex === 1;

            return (
              <div
                key={`${copyIndex}-${card.title}`}
                ref={
                  cardIndex === 0
                    ? copyIndex === 0
                      ? leadingSetRef
                      : copyIndex === 1
                        ? accessibleSetRef
                        : undefined
                    : undefined
                }
                role={accessible ? 'listitem' : 'presentation'}
                aria-hidden={!accessible || undefined}
                inert={!accessible || undefined}
                data-carousel-copy={copyIndex}
              >
                <ServiceCard card={card} />
              </div>
            );
          })
        )}
      </div>

      {hasCarouselControls && (
        <>
          <button
            type="button"
            aria-label={`Show previous products in ${label}`}
            onClick={() => {
              setHasInteracted(true);
              move(-1);
            }}
            className="focus-ring absolute left-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e2e5]/95 text-black/60 shadow-sm backdrop-blur transition hover:bg-[#d7d7da] hover:text-black md:flex"
          >
            <ChevronLeft aria-hidden="true" size={24} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label={`Show next products in ${label}`}
            onClick={() => {
              setHasInteracted(true);
              move(1);
            }}
            className="focus-ring absolute right-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e2e5]/95 text-black/60 shadow-sm backdrop-blur transition hover:bg-[#d7d7da] hover:text-black md:flex"
          >
            <ChevronRight aria-hidden="true" size={24} strokeWidth={2.4} />
          </button>
        </>
      )}
    </div>
  );
}
