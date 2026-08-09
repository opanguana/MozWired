import type { CatalogAvailability } from '@/catalog/schema';
import type { CatalogListingItem } from '@/catalog/listing';

import { catalogProducts } from './catalog';

function unique(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function availabilityFor(product: (typeof catalogProducts)[number]) {
  return unique([
    product.product.availability,
    ...product.variants.map(({ availability }) => availability),
  ]) as CatalogAvailability[];
}

export const catalogListingItems: CatalogListingItem[] = catalogProducts.map((product, index) => {
  const primaryVariant = product.variants[0];
  const processors = unique(
    product.variants.map(({ specifications }) => specifications?.processor)
  );
  const ram = unique(product.variants.map(({ ram }) => ram));
  const storage = unique(product.variants.map(({ storage }) => storage));
  const network = unique(product.variants.map(({ network }) => network));

  return {
    slug: product.slug,
    href: product.card.href ?? `/products/${product.slug}`,
    brand: product.brand,
    title: product.card.title,
    category: product.category,
    description: product.card.description,
    image: product.card.image,
    price: product.card.price,
    availability: availabilityFor(product),
    conditions: unique(product.variants.map(({ condition }) => condition)),
    processors,
    ram,
    storage,
    network,
    specification: unique([
      primaryVariant?.specifications?.processor,
      primaryVariant?.ram ? `${primaryVariant.ram} RAM` : null,
      primaryVariant?.storage,
      primaryVariant?.network,
    ]).join(' · '),
    featuredRank: product.navigation.featured
      ? (product.navigation.order ?? index)
      : 10_000 + index,
  };
});
