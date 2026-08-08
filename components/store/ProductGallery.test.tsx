import { fireEvent, render, screen } from '@testing-library/react';

import { ProductGallery } from './ProductGallery';

const images = [
  {
    id: 'phone-main',
    role: 'main' as const,
    src: '/images/store/iphone.png',
    alt: 'Phone front view',
    sortOrder: 0,
  },
  {
    id: 'phone-back',
    role: 'gallery' as const,
    src: '/images/store/accessories.png',
    alt: 'Phone rear view',
    sortOrder: 1,
  },
];

describe('ProductGallery', () => {
  it('uses accessible controls to select another product image', () => {
    render(
      <ProductGallery images={images} productTitle="Test phone" description="Product details" />
    );

    const nextImage = screen.getByRole('button', {
      name: 'Show image 2: Phone rear view',
    });
    expect(nextImage).toHaveClass('size-11');
    expect(nextImage.closest('.relative')).toHaveClass('min-h-[clamp(24rem,75svh,30rem)]');
    fireEvent.click(nextImage);

    expect(nextImage).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByAltText('Phone rear view')).toBeInTheDocument();
  });

  it('keeps the accessible placeholder when a product has no media', () => {
    render(<ProductGallery images={[]} productTitle="Test phone" description="Product details" />);

    expect(
      screen.getByRole('img', { name: 'Test phone product image coming soon' })
    ).toBeInTheDocument();
  });
});
