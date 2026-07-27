import { catalogProducts, getCatalogProduct } from './catalog';

describe('product catalog routes', () => {
  it('provides one unique detail route for every catalog product', () => {
    const slugs = catalogProducts.map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getCatalogProduct('macbook-air')?.card.title).toBe('MacBook Air');
    expect(getCatalogProduct('galaxy-a06')?.variants).toHaveLength(2);
  });
});
