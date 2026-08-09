import { act, fireEvent, render, screen } from '@testing-library/react';

import type { ServiceCardData } from './ServiceCard';
import { CardCarousel } from './CardCarousel';
import { mznPrice } from '@/types/money';

const cards: ServiceCardData[] = Array.from({ length: 5 }, (_, index) => ({
  eyebrow: `Product ${index + 1}`,
  title: `Device ${index + 1}`,
  description: 'A concise product description.',
  price: mznPrice((index + 1) * 100_000),
}));

describe('CardCarousel', () => {
  it('adds gallery controls when a collection contains more than four cards', () => {
    render(<CardCarousel cards={cards} label="Featured devices" fullBleed />);

    expect(
      screen.getByRole('button', { name: 'Show previous products in Featured devices' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Show next products in Featured devices' })
    ).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Featured devices' }).parentElement).toHaveClass(
      'w-full'
    );
    expect(screen.getByRole('list', { name: 'Featured devices' })).toHaveClass(
      'card-scroll-full-bleed'
    );
    expect(screen.getByRole('list', { name: 'Featured devices' })).toHaveClass(
      'card-scroll-content-window'
    );
    expect(document.querySelectorAll('[data-carousel-copy]')).toHaveLength(15);
    expect(document.querySelectorAll('[data-carousel-copy="0"][aria-hidden="true"]')).toHaveLength(
      5
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(5);

    const leadingCopies = document.querySelectorAll<HTMLElement>('[data-carousel-copy="0"]');
    const accessibleCopies = document.querySelectorAll<HTMLElement>('[data-carousel-copy="1"]');
    const trailingCopies = document.querySelectorAll<HTMLElement>('[data-carousel-copy="2"]');

    [...leadingCopies, ...trailingCopies].forEach((copy) => {
      expect(copy).not.toHaveAttribute('inert');
      expect(copy.querySelector('a')).toHaveAttribute('tabindex', '-1');
      expect(copy.querySelector('a')).toHaveAttribute('href');
    });
    accessibleCopies.forEach((copy) => {
      expect(copy).not.toHaveAttribute('aria-hidden');
      expect(copy.querySelector('a')).not.toHaveAttribute('tabindex');
    });

    fireEvent.pointerDown(screen.getByRole('list', { name: 'Featured devices' }));
    expect(screen.getByRole('list', { name: 'Featured devices' })).toHaveClass(
      'card-scroll-content-window'
    );
    expect(
      screen.getByRole('button', { name: 'Show previous products in Featured devices' })
    ).toHaveClass('card-carousel-control-start');
    expect(
      screen.getByRole('button', { name: 'Show next products in Featured devices' })
    ).toHaveClass('card-carousel-control-end');
  });

  it('keeps four-card collections as a scrollable rail without gallery controls', () => {
    render(<CardCarousel cards={cards.slice(0, 4)} label="Featured devices" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Featured devices' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Featured devices' }).parentElement).toHaveClass(
      'max-w-store'
    );
    expect(screen.getByRole('list', { name: 'Featured devices' })).not.toHaveClass(
      'card-scroll-full-bleed'
    );
    expect(screen.getByRole('list', { name: 'Featured devices' })).toHaveClass(
      'safe-page-padding'
    );
    expect(document.querySelectorAll('[data-carousel-copy]')).toHaveLength(4);
  });

  it('uses the same full-bleed geometry for a four-card collection', () => {
    render(<CardCarousel cards={cards.slice(0, 4)} label="Featured devices" fullBleed />);

    const scroller = screen.getByRole('list', { name: 'Featured devices' });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(scroller.parentElement).toHaveClass('card-carousel-full-bleed', 'w-full');
    expect(scroller).toHaveClass('card-scroll-full-bleed', 'card-scroll-content-window', 'gap-3');
    expect(document.querySelectorAll('[data-carousel-copy]')).toHaveLength(4);
  });

  it('repositions by one card-set width after scrolling settles at either loop boundary', () => {
    jest.useFakeTimers();
    render(<CardCarousel cards={cards} label="Featured devices" fullBleed />);

    const scroller = screen.getByRole('list', { name: 'Featured devices' });
    const leadingStart = document.querySelector('[data-carousel-copy="0"]');
    const accessibleStart = document.querySelector('[data-carousel-copy="1"]');

    Object.defineProperty(leadingStart, 'offsetLeft', { configurable: true, value: 20 });
    Object.defineProperty(accessibleStart, 'offsetLeft', { configurable: true, value: 1020 });

    scroller.scrollLeft = 400;
    fireEvent.scroll(scroller);
    expect(scroller.scrollLeft).toBe(400);
    expect(scroller).toHaveClass('card-scroll-content-window');
    act(() => jest.advanceTimersByTime(140));
    expect(scroller.scrollLeft).toBe(1400);

    scroller.scrollLeft = 1600;
    fireEvent.scroll(scroller);
    act(() => jest.advanceTimersByTime(140));
    expect(scroller.scrollLeft).toBe(600);
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('moves by the number of complete cards visible when a chevron is clicked', () => {
    render(<CardCarousel cards={cards} label="Featured devices" fullBleed />);

    const scroller = screen.getByRole('list', { name: 'Featured devices' });
    const firstCard = scroller.firstElementChild as HTMLElement;
    const secondCard = firstCard.nextElementSibling as HTMLElement;
    const scrollBy = jest.fn();

    Object.defineProperty(scroller, 'clientWidth', { configurable: true, value: 1408 });
    Object.defineProperty(firstCard, 'offsetLeft', { configurable: true, value: 32 });
    Object.defineProperty(secondCard, 'offsetLeft', { configurable: true, value: 364 });
    Object.defineProperty(scroller, 'scrollBy', { configurable: true, value: scrollBy });

    fireEvent.click(
      screen.getByRole('button', { name: 'Show next products in Featured devices' })
    );

    expect(scroller).toHaveClass('card-scroll-content-window');
    expect(scrollBy).toHaveBeenCalledWith({
      left: 1328,
      behavior: 'smooth',
    });
  });

  it.each([
    ['touch', (scroller: HTMLElement) => fireEvent.touchStart(scroller)],
    ['wheel', (scroller: HTMLElement) => fireEvent.wheel(scroller)],
    ['keyboard', (scroller: HTMLElement) => fireEvent.keyDown(scroller, { key: 'ArrowRight' })],
  ])('keeps the content window after %s interaction', (_, interact) => {
    render(<CardCarousel cards={cards} label="Featured devices" fullBleed />);

    const scroller = screen.getByRole('list', { name: 'Featured devices' });
    expect(scroller).toHaveClass('card-scroll-content-window');

    interact(scroller);

    expect(scroller).toHaveClass('card-scroll-content-window');
  });
});
