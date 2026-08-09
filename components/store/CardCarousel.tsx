'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

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
  const loopMaintenanceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hasCarouselControls = cards.length > 4;
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
      clearTimeout(loopMaintenanceTimerRef.current);
    };
  }, [maintainLoop]);

  const scheduleLoopMaintenance = () => {
    clearTimeout(loopMaintenanceTimerRef.current);
    loopMaintenanceTimerRef.current = setTimeout(maintainLoop, 140);
  };

  const move = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const firstCard = scroller.firstElementChild as HTMLElement | null;
    const secondCard = firstCard?.nextElementSibling as HTMLElement | null;
    const cardStride =
      firstCard && secondCard ? secondCard.offsetLeft - firstCard.offsetLeft : 0;
    const inlinePadding = Number.parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
    const visibleWidth = Math.max(scroller.clientWidth - inlinePadding * 2, 0);
    const cardsPerView =
      cardStride > 0 ? Math.max(1, Math.floor((visibleWidth + 12) / cardStride)) : 0;
    const distance =
      cardStride > 0
        ? cardStride * cardsPerView
        : Math.max(scroller.clientWidth * 0.85, 296);

    scroller.scrollBy({
      left: direction * distance,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div
      className={cn(
        'relative mt-5',
        fullBleed ? 'card-carousel-full-bleed w-full' : 'mx-auto max-w-store'
      )}
    >
      <div
        ref={scrollerRef}
        className={cn(
          'card-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto pb-5',
          fullBleed ? 'card-scroll-full-bleed' : 'safe-page-padding',
          fullBleed && 'card-scroll-content-window'
        )}
        role="list"
        aria-label={label}
        onScroll={scheduleLoopMaintenance}
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
                data-carousel-copy={copyIndex}
              >
                <ServiceCard card={card} linkTabIndex={accessible ? undefined : -1} />
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
            onClick={() => move(-1)}
            className={cn(
              'focus-ring absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e2e5]/95 text-black/60 shadow-sm backdrop-blur transition hover:bg-[#d7d7da] hover:text-black md:flex',
              fullBleed ? 'card-carousel-control-start' : 'left-3'
            )}
          >
            <ChevronLeft aria-hidden="true" size={24} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label={`Show next products in ${label}`}
            onClick={() => move(1)}
            className={cn(
              'focus-ring absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#e2e2e5]/95 text-black/60 shadow-sm backdrop-blur transition hover:bg-[#d7d7da] hover:text-black md:flex',
              fullBleed ? 'card-carousel-control-end' : 'right-3'
            )}
          >
            <ChevronRight aria-hidden="true" size={24} strokeWidth={2.4} />
          </button>
        </>
      )}
    </div>
  );
}
