import { getCatalog, groupCatalogProducts } from '@/catalog/load';
import { toDisplayVariant, toServiceCard } from '@/catalog/presentation';
import type { CatalogCategory, CatalogProduct as CatalogRecord } from '@/catalog/schema';

export type CatalogProduct = {
  product: CatalogRecord;
  card: ReturnType<typeof toServiceCard>;
  slug: string;
  brand: string;
  category: CatalogCategory;
  navigation: CatalogRecord['navigation'];
  variants: ReturnType<typeof toDisplayVariant>[];
};

const sourceProducts = getCatalog();

export const catalogProducts: CatalogProduct[] = groupCatalogProducts(sourceProducts).map((product) => ({
  product,
  card: toServiceCard(product),
  slug: product.slug,
  brand: product.brand,
  category: product.category,
  navigation: product.navigation,
  variants: product.variants.map((variant) => toDisplayVariant(variant)),
}));

export function getCatalogProduct(slug: string) {
  const source = sourceProducts.find((product) => product.slug === slug);
  if (!source) return undefined;

  return catalogProducts.find(
    ({ product }) =>
      product.id === source.id ||
      (source.productGroupId !== null && product.productGroupId === source.productGroupId)
  );
}
