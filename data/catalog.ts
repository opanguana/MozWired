import { getCatalog } from '@/catalog/load';
import { toDisplayVariant, toServiceCard } from '@/catalog/presentation';
import type { CatalogCategory, CatalogProduct as CatalogRecord } from '@/catalog/schema';

export type CatalogProduct = {
  product: CatalogRecord;
  card: ReturnType<typeof toServiceCard>;
  slug: string;
  brand: string;
  category: CatalogCategory;
  variants: ReturnType<typeof toDisplayVariant>[];
};

export const catalogProducts: CatalogProduct[] = getCatalog().map((product) => ({
  product,
  card: toServiceCard(product),
  slug: product.slug,
  brand: product.brand,
  category: product.category,
  variants: product.variants.map((variant) => toDisplayVariant(variant)),
}));

export function getCatalogProduct(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}
