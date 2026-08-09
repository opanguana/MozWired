import type { ServiceCardData } from '@/components/store/ServiceCard';

import { getCatalogProduct } from './catalog';

/**
 * Temporary merchandising selection until the catalogue gains a reviewed
 * new-arrival lifecycle field. Order here is the storefront display order.
 */
export const newArrivalSlugs = [
  'galaxy-a57',
  'redmi-note-14-pro',
  'galaxy-a37',
  'redmi-note-14s',
  'galaxy-a56',
  'redmi-note-14',
  'redmi-15',
  'redmi-15c',
] as const;

export type NewArrivalCardData = Pick<
  ServiceCardData,
  'href' | 'brand' | 'title' | 'price' | 'image'
> & {
  specification?: string;
};

export const newArrivalCards: NewArrivalCardData[] = newArrivalSlugs.map((slug) => {
  const product = getCatalogProduct(slug);
  if (!product) throw new Error(`New arrival does not exist in the active catalogue: ${slug}`);

  const variant = product.variants[0];
  const specification = [variant?.storage, variant?.ram, variant?.network]
    .filter(Boolean)
    .join(' · ');

  return {
    href: product.card.href,
    brand: product.card.brand,
    title: product.card.title,
    price: product.card.price,
    image: product.card.image,
    specification: specification || undefined,
  };
});
