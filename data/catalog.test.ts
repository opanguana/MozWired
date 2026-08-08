import { catalogProducts, getCatalogProduct } from './catalog';
import { productSearchIndex } from './product-search';

describe('product catalog routes', () => {
  it('provides one unique detail route for every catalog product', () => {
    const slugs = catalogProducts.map(({ slug }) => slug);

    expect(catalogProducts).toHaveLength(81);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(getCatalogProduct('macbook-air')).toBeUndefined();
    expect(getCatalogProduct('galaxy-a06')?.variants).toHaveLength(2);
    expect(getCatalogProduct('galaxy-a36')?.variants).toHaveLength(2);
    expect(getCatalogProduct('targus-tbb565gl-74')).toMatchObject({
      slug: 'targus-tbb565gl-74',
      card: {
        title: 'Intellect',
        href: '/products/targus-tbb565gl-74',
      },
    });
  });

  it('presents explicitly grouped inventory records as one product with separate variants', () => {
    const grouped = getCatalogProduct('ideapad-1-15iau7');

    expect(grouped).toMatchObject({
      slug: 'ideapad-1-15iau7',
      card: {
        title: 'IdeaPad 1',
        price: {
          amount: { amountMinor: 4_935_000, currency: 'MZN' },
          label: 'from',
        },
      },
    });
    expect(grouped?.variants.map(({ sku }) => sku)).toEqual([
      'TMP-LEN-IDEAPAD-1-15IAU7-644f99',
      'TMP-LEN-IDEAPAD-1-15IRU7-7f3307',
    ]);
    expect(getCatalogProduct('ideapad-1-15iru7')).toBe(grouped);
  });

  it('keeps manufacturer identity separate from public model titles', () => {
    const duplicatedBrandTitles = catalogProducts.filter(({ brand, card }) =>
      card.title.toLowerCase().startsWith(`${brand.toLowerCase()} `)
    );

    expect(duplicatedBrandTitles).toEqual([]);
  });

  it('makes every published product discoverable through search', () => {
    const searchableSlugs = new Set(productSearchIndex.map(({ slug }) => slug));

    expect(searchableSlugs.size).toBe(catalogProducts.length);
    catalogProducts.forEach(({ slug }) => expect(searchableSlugs).toContain(slug));
  });

  it('uses PNG product cutouts throughout Endless possibilities', () => {
    const possibilities = catalogProducts.filter(({ product }) =>
      product.placements.some(({ section }) => section === 'possibilities')
    );

    expect(possibilities).toHaveLength(9);
    possibilities.forEach(({ card, slug }) => {
      expect(card.image).toMatch(new RegExp(`/hp/${slug}/main-clean\\.png$`));
    });
  });

  it('uses PNG product cutouts throughout Smartphones for every budget', () => {
    const smartphones = catalogProducts.filter(({ product }) =>
      product.placements.some(({ section }) => section === 'favorites')
    );

    expect(smartphones).toHaveLength(23);
    smartphones.forEach(({ card }) => {
      expect(card.image).toMatch(
        /\/images\/products\/(?:redmi|samsung)\/[^/]+\/main\.png$/
      );
    });
  });
});
