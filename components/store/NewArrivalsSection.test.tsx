import { fireEvent, render, screen, within } from '@testing-library/react';

import { mznPrice } from '@/types/money';

import { NewArrivalsSection } from './NewArrivalsSection';

const cards = Array.from({ length: 8 }, (_, index) => ({
  href: `/products/device-${index + 1}`,
  brand: index % 2 ? 'Redmi' : 'Samsung',
  title: `Device ${index + 1}`,
  specification: '256GB · 8GB RAM · 5G',
  price: mznPrice((index + 1) * 100_000),
  image: `/images/products/test/device-${index + 1}/main.png`,
}));

describe('NewArrivalsSection', () => {
  it('renders catalogue-backed cards as a compact snap-scrolling list', () => {
    render(<NewArrivalsSection cards={cards} />);

    const section = screen.getByRole('region', { name: 'New arrivals' });
    const list = within(section).getByRole('list', { name: 'New arrivals' });

    expect(list).toHaveClass(
      'card-scroll',
      'card-scroll-full-bleed',
      'snap-x',
      'overflow-x-auto'
    );
    expect(list).not.toHaveClass('card-scroll-content-window');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(8);
    items.forEach((item) => expect(item).toHaveClass('h-[21rem]', 'w-56', 'snap-start'));
    expect(within(list).getAllByText('NEW')).toHaveLength(8);
    expect(within(section).getByRole('link', { name: 'View all' })).toHaveAttribute(
      'href',
      '#favorites'
    );
  });

  it('moves a viewport-sized group while keeping the last cards reachable', () => {
    render(<NewArrivalsSection cards={cards} />);

    const list = screen.getByRole('list', { name: 'New arrivals' });
    const first = list.firstElementChild as HTMLElement;
    const second = first.nextElementSibling as HTMLElement;
    const scrollBy = jest.fn();

    Object.defineProperty(list, 'clientWidth', { configurable: true, value: 708 });
    Object.defineProperty(first, 'offsetLeft', { configurable: true, value: 20 });
    Object.defineProperty(second, 'offsetLeft', { configurable: true, value: 256 });
    Object.defineProperty(list, 'scrollBy', { configurable: true, value: scrollBy });

    fireEvent.click(screen.getByRole('button', { name: 'Show next new arrivals' }));

    expect(scrollBy).toHaveBeenCalledWith({ left: 708, behavior: 'smooth' });
  });
});
