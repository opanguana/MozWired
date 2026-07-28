import catalogSource from '@/data/catalog-source.json';

import { validateCatalogMedia } from './media-validation';
import { resolveProductPrice } from './pricing';
import type { CatalogProduct } from './schema';
import { validateCatalog } from './validation';

const validatedSource = validateCatalog(catalogSource).products;
const baseProduct = validatedSource[0];
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

describe('validated product catalogue', () => {
  it('accepts the published catalogue and verifies media assets', () => {
    const result = validateCatalog(catalogSource);
    result.issues.push(...validateCatalogMedia(result.products));

    expect(result.issues).toEqual([]);
    expect(result.products).toHaveLength(43);
    expect(result.products.flatMap(({ variants }) => variants)).toHaveLength(36);
  });

  it('rejects duplicate stable identifiers and SKUs', () => {
    const duplicate = clone(
      validatedSource.find(({ variants }) => variants.length) as CatalogProduct
    );
    const result = validateCatalog([duplicate, duplicate]);

    expect(result.issues.map(({ message }) => message)).toEqual(
      expect.arrayContaining(['Duplicate product ID.', 'Duplicate product slug.', 'Duplicate SKU.'])
    );
  });

  it('isolates malformed records instead of publishing them', () => {
    const malformed = { ...baseProduct, id: 'Invalid ID', pricing: { amountMinor: 'free' } };
    const result = validateCatalog([baseProduct, malformed]);

    expect(result.products).toHaveLength(1);
    expect(result.issues.some(({ product }) => product === 'Invalid ID')).toBe(true);
  });

  it('resolves scheduled prices without mutating the MZN base price', () => {
    const product: CatalogProduct = {
      ...clone(baseProduct),
      pricing: {
        currency: 'MZN',
        amountMinor: 100_000,
        label: 'exact',
        vatIncluded: false,
        effectiveFrom: null,
        effectiveUntil: null,
      },
      scheduledPrices: [
        {
          currency: 'MZN',
          amountMinor: 90_000,
          label: 'exact',
          vatIncluded: false,
          effectiveFrom: '2026-07-28T00:00:00+02:00',
          effectiveUntil: '2026-08-01T00:00:00+02:00',
        },
      ],
    };

    expect(resolveProductPrice(product, new Date('2026-07-29T00:00:00+02:00'))?.amountMinor).toBe(
      90_000
    );
    expect(resolveProductPrice(product, new Date('2026-08-02T00:00:00+02:00'))?.amountMinor).toBe(
      100_000
    );
  });
});
