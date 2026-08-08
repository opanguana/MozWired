import { fireEvent, render, screen } from '@testing-library/react';

import ProductPage, { generateStaticParams } from './page';

describe('dynamic product page', () => {
  it('renders supplied smartphone variants for the selected product', async () => {
    render(await ProductPage({ params: Promise.resolve({ slug: 'galaxy-a06' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Buy Galaxy A06' })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: 'Galaxy A06 available configurations' })
    ).toBeInTheDocument();
    expect(screen.getByText('64GB · 4GB RAM · 4G')).toBeInTheDocument();
    expect(screen.getAllByText(/8,550/)).not.toHaveLength(0);
    expect(screen.queryByRole('link', { name: '← Back to the store' })).not.toBeInTheDocument();
    expect(screen.queryByText('Made for the essentials')).not.toBeInTheDocument();
  });

  it('selects grouped computer inventory by SKU and updates the enquiry', async () => {
    render(await ProductPage({ params: Promise.resolve({ slug: 'ideapad-1-15iau7' }) }));

    expect(screen.getByRole('heading', { level: 1, name: 'Buy IdeaPad 1' })).toBeInTheDocument();
    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(2);
    expect(screen.getByText('From MZN 47,000')).toBeInTheDocument();
    expect(screen.getAllByText('Contact us for availability')).toHaveLength(2);
    const initialLink = screen.getByRole('link', { name: 'Talk to a specialist' });
    const initialMessage = new URL(initialLink.getAttribute('href')!).searchParams.get('text');

    expect(initialMessage).toContain((options[0] as HTMLInputElement).value);

    fireEvent.click(options[1]);

    expect(options[1]).toBeChecked();
    expect(
      screen.getByText(/Selected configuration · TMP-LEN-IDEAPAD-1-15IRU7/)
    ).toBeInTheDocument();
    const selectedLink = screen.getByRole('link', { name: 'Talk to a specialist' });
    const selectedUrl = new URL(selectedLink.getAttribute('href')!);
    const selectedMessage = selectedUrl.searchParams.get('text');

    expect(selectedUrl.pathname).toBe('/258871369815');
    expect(selectedMessage).toContain('Produto: Lenovo IdeaPad 1');
    expect(selectedMessage).toContain('TMP-LEN-IDEAPAD-1-15IRU7-7f3307');
    expect(selectedMessage).not.toBe(initialMessage);
    expect(selectedLink).toHaveAttribute('target', '_blank');
    expect(selectedLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('prebuilds a route for every catalog product', () => {
    expect(generateStaticParams()).toEqual(
      expect.arrayContaining([{ slug: 'galaxy-a06' }, { slug: 'thinkpad-x1-carbon-gen-13' }])
    );
    expect(generateStaticParams()).not.toContainEqual({ slug: 'macbook-air' });
  });
});
