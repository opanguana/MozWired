import { getPrimaryProductImage, toDisplayPrice } from '@/catalog/presentation';
import { resolveProductPrice } from '@/catalog/pricing';
import type { CatalogProduct } from '@/catalog/schema';
import type { ProductPrice } from '@/types/money';

export type ProductSearchItem = {
  slug: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  specifications: string[];
  price: ProductPrice | null;
  image: string | null;
};

export function toProductSearchItem(
  product: CatalogProduct,
  now = new Date()
): ProductSearchItem {
  const specifications = product.variants
    .filter(({ status }) => status === 'active')
    .flatMap(({ storage, ram, network, specifications: details }) => [
      storage,
      ram,
      network,
      details?.processor,
      details?.display,
      details?.operatingSystem,
      details?.graphics,
      details?.colour,
      ...(details?.includedItems ?? []),
    ])
    .filter((value): value is string => Boolean(value));

  return {
    slug: product.slug,
    title: product.title,
    brand: product.brand,
    category: product.category,
    description: product.content.en.description,
    specifications: [...new Set(specifications)],
    price: toDisplayPrice(resolveProductPrice(product, now)),
    image: getPrimaryProductImage(product)?.src ?? null,
  };
}

export function buildProductSearchIndex(products: CatalogProduct[], now = new Date()) {
  return products
    .filter(({ status }) => status === 'published')
    .map((product) => toProductSearchItem(product, now));
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase();
}

export function filterProductSearchIndex(items: ProductSearchItem[], query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return items;

  const terms = normalizedQuery.split(/\s+/);

  return items.filter((item) => {
    const searchableText = normalizeSearchText(
      [item.title, item.brand, item.category, item.description, ...item.specifications].join(' ')
    );

    return terms.every((term) => searchableText.includes(term));
  });
}
