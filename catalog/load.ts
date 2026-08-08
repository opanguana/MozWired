import catalogSource from '@/data/catalog-source.json';

import { resolveProductPrice } from './pricing';
import type { CatalogProduct } from './schema';
import { validateCatalog } from './validation';

const validation = validateCatalog(catalogSource);

if (validation.issues.length) {
  validation.issues.forEach(({ product, path, message }) => {
    console.error(`[catalog:${product}] ${path}: ${message}`);
  });
}

const invalidProductIds = new Set(validation.issues.map(({ product }) => product));
const validCatalog = validation.products.filter((product) => !invalidProductIds.has(product.id));

export function getCatalog({
  includeDrafts = false,
  includeArchived = false,
}: {
  includeDrafts?: boolean;
  includeArchived?: boolean;
} = {}): CatalogProduct[] {
  return validCatalog
    .filter(
      (product) =>
        product.status === 'published' ||
        (includeDrafts && product.status === 'draft') ||
        (includeArchived && product.status === 'archived')
    )
    .map((product) => ({
      ...product,
      variants: includeArchived
        ? product.variants
        : product.variants.filter(({ status }) => status === 'active'),
    }));
}

export function getCatalogProduct(
  slug: string,
  options?: { includeDrafts?: boolean; includeArchived?: boolean }
) {
  return getCatalog(options).find((product) => product.slug === slug);
}

export function getProductsForSection(section: string) {
  return groupCatalogProducts(getCatalog())
    .flatMap((product) =>
      product.placements
        .filter((placement) => placement.section === section)
        .map((placement) => ({ product, order: placement.order }))
    )
    .sort((left, right) => left.order - right.order)
    .map(({ product }) => product);
}

/**
 * Builds storefront products without changing the inventory records in the source catalogue.
 * Records with the same explicit group ID become one presentation product whose variants remain
 * independently identifiable by SKU.
 */
export function groupCatalogProducts(products: CatalogProduct[]) {
  const groups = new Map<string, CatalogProduct[]>();

  products.forEach((product) => {
    const key = product.productGroupId ? `group:${product.productGroupId}` : `product:${product.id}`;
    groups.set(key, [...(groups.get(key) ?? []), product]);
  });

  return [...groups.values()].map((members) => {
    const representative = members[0];
    if (members.length === 1 || !representative.productGroupId) return representative;

    const placements = [...members.flatMap(({ placements }) => placements)]
      .sort((left, right) => left.order - right.order)
      .filter(
        (placement, index, all) =>
          all.findIndex(({ section }) => section === placement.section) === index
      );

    return {
      ...representative,
      title: representative.productGroupTitle ?? representative.title,
      pricing: null,
      scheduledPrices: [],
      variants: members.flatMap(({ variants }) => variants),
      placements,
    };
  });
}

export function getResolvedProductPrice(product: CatalogProduct, now = new Date()) {
  return resolveProductPrice(product, now);
}
