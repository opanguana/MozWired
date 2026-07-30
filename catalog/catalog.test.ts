import catalogSource from '@/data/catalog-source.json';

import { validateCatalogMedia } from './media-validation';
import {
  getLocalizedProductContent,
  getPrimaryProductImage,
  getProductImages,
} from './presentation';
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

  it('selects the designated primary image and orders the gallery', () => {
    const product = clone(baseProduct);
    const primary = getPrimaryProductImage(product);

    expect(primary?.role).toBe('main');
    expect(getProductImages(product)).toEqual(
      [...(product.media?.images ?? [])].sort((left, right) => left.sortOrder - right.sortOrder)
    );
  });

  it('falls back to approved English content while Portuguese is in editorial review', () => {
    expect(getLocalizedProductContent(baseProduct, 'pt-MZ')).toBe(baseProduct.content.en);
  });

  it('rejects approved localized content with missing copy', () => {
    const product = clone(baseProduct);
    product.content['pt-MZ'].status = 'approved';
    const result = validateCatalog([product]);

    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'content.pt-MZ',
          message: 'Approved localized content requires an eyebrow and description.',
        }),
      ])
    );
  });

  it('rejects invalid primary references and duplicate media identifiers', () => {
    const product = clone(baseProduct);
    if (!product.media) throw new Error('Fixture must contain media.');

    product.media.primaryImageId = 'missing-image';
    product.media.images.push({ ...product.media.images[0] });
    const result = validateCatalog([product]);

    expect(result.issues.map(({ message }) => message)).toEqual(
      expect.arrayContaining([
        'primaryImageId must reference an image in this product.',
        'Image IDs must be unique within a product.',
        'Image sort orders must be unique within a product.',
      ])
    );
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
