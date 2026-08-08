import catalogSource from '@/data/catalog-source.json';

import { planProductImageUpdate } from './product-image-workflow';
import { validateCatalog } from './validation';

const products = validateCatalog(catalogSource).products;

describe('product image update planning', () => {
  it('replaces a primary image while preserving its stable media ID', () => {
    const product = products.find(({ slug }) => slug === 'galaxy-a06')!;
    const existingId = product.media!.primaryImageId;
    const plan = planProductImageUpdate({
      product,
      extension: '.webp',
      role: 'main',
      alt: 'Samsung Galaxy A06 shown from the front',
      updatedAt: '2026-08-08T12:00:00.000Z',
    });

    expect(plan.publicPath).toBe('/images/products/samsung/galaxy-a06/main.webp');
    expect(plan.image.id).toBe(existingId);
    expect(plan.product.media?.primaryImageId).toBe(existingId);
    expect(plan.image.alt).toBe('Samsung Galaxy A06 shown from the front');
  });

  it('adds an ordered gallery image without changing the primary image', () => {
    const product = products.find(({ slug }) => slug === 'galaxy-a06')!;
    const plan = planProductImageUpdate({
      product,
      extension: '.png',
      role: 'gallery',
      updatedAt: '2026-08-08T12:00:00.000Z',
    });

    expect(plan.publicPath).toBe('/images/products/samsung/galaxy-a06/gallery-1.png');
    expect(plan.product.media?.primaryImageId).toBe(product.media?.primaryImageId);
    expect(plan.product.media?.images).toHaveLength(product.media!.images.length + 1);
  });

  it('rejects unsupported source formats', () => {
    expect(() =>
      planProductImageUpdate({
        product: products[0],
        extension: '.gif',
        role: 'main',
        updatedAt: '2026-08-08T12:00:00.000Z',
      })
    ).toThrow('Unsupported image extension');
  });

  it('requires a main image before accepting gallery images', () => {
    expect(() =>
      planProductImageUpdate({
        product: { ...products[0], media: null },
        extension: '.webp',
        role: 'gallery',
        updatedAt: '2026-08-08T12:00:00.000Z',
      })
    ).toThrow('Add a main image before adding gallery images');
  });
});
