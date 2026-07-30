import { catalogProducts, getCatalogProduct } from './catalog';

describe('product catalog routes', () => {
  it('provides one unique detail route for every catalog product', () => {
    const slugs = catalogProducts.map(({ slug }) => slug);

    expect(catalogProducts).toHaveLength(82);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getCatalogProduct('macbook-air')).toBeUndefined();
    expect(getCatalogProduct('galaxy-a06')?.variants).toHaveLength(2);
    expect(getCatalogProduct('galaxy-a36')?.variants).toHaveLength(2);
  });
});
