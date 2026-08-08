import type { CatalogProduct } from './schema';
import {
  arrangeHomepageSection,
  getHomepageSectionSlugs,
} from './homepage-placement';

function product(slug: string, order: number): CatalogProduct {
  return {
    id: slug,
    slug,
    productGroupId: null,
    productGroupTitle: null,
    status: 'published',
    brand: 'Test',
    title: slug,
    content: {
      en: { eyebrow: 'Test', description: 'Test product', status: 'approved' },
      'pt-MZ': { eyebrow: null, description: null, status: 'draft' },
    },
    category: 'phones',
    media: null,
    availability: 'price_on_request',
    pricing: null,
    scheduledPrices: [],
    variants: [],
    placements: [{ section: 'favorites', order }],
    navigation: { featured: false, order: null },
    cardTone: 'default',
    updatedAt: '2026-08-08T00:00:00+02:00',
  };
}

describe('homepage placement ordering', () => {
  const products = [product('phone-a', 0), product('phone-b', 1), product('phone-c', 2)];

  it('promotes chosen products and preserves all remaining cards', () => {
    const arranged = arrangeHomepageSection(products, 'favorites', ['phone-c', 'phone-a']);

    expect(getHomepageSectionSlugs(arranged, 'favorites')).toEqual([
      'phone-c',
      'phone-a',
      'phone-b',
    ]);
    expect(products[0].placements[0].order).toBe(0);
  });

  it('rejects products that do not belong to the selected section', () => {
    expect(() => arrangeHomepageSection(products, 'favorites', ['unknown-phone'])).toThrow(
      'Products are not currently assigned to favorites: unknown-phone'
    );
  });
});
