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
}: {
  includeDrafts?: boolean;
} = {}): CatalogProduct[] {
  return validCatalog.filter((product) => includeDrafts || product.status === 'published');
}

export function getCatalogProduct(slug: string, options?: { includeDrafts?: boolean }) {
  return getCatalog(options).find((product) => product.slug === slug);
}

export function getProductsForSection(section: string) {
  return getCatalog()
    .flatMap((product) =>
      product.placements
        .filter((placement) => placement.section === section)
        .map((placement) => ({ product, order: placement.order }))
    )
    .sort((left, right) => left.order - right.order)
    .map(({ product }) => product);
}

export function getResolvedProductPrice(product: CatalogProduct, now = new Date()) {
  return resolveProductPrice(product, now);
}
