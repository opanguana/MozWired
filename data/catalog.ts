import type { ServiceCardData } from '@/components/store/ServiceCard';
import { toProductSlug } from '@/lib/product-slug';

import { featuredProducts } from './products';
import { buildSmartphoneCards, smartphoneInventory, type SmartphoneSku } from './smartphones';

export type CatalogProduct = {
  card: ServiceCardData;
  slug: string;
  brand?: SmartphoneSku['brand'];
  variants: SmartphoneSku[];
};

const smartphoneCards = [...buildSmartphoneCards('Samsung'), ...buildSmartphoneCards('Apple')];

export const catalogProducts: CatalogProduct[] = [
  ...featuredProducts.map((card) => ({
    card,
    slug: toProductSlug(card.title),
    variants: [],
  })),
  ...smartphoneCards.map((card) => ({
    card,
    slug: toProductSlug(card.title),
    brand: smartphoneInventory.find(({ model }) => model === card.title)?.brand,
    variants: smartphoneInventory.filter(({ model }) => model === card.title),
  })),
];

export function getCatalogProduct(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}
