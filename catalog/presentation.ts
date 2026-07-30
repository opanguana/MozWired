import type { ServiceCardData } from '@/components/store/ServiceCard';
import type { ProductPrice } from '@/types/money';
import type { SupportedLanguage } from '@/types/locale';

import { resolveProductPrice, resolveVariantPrice } from './pricing';
import type { CatalogPrice, CatalogProduct, CatalogVariant } from './schema';

export function getProductImages(product: CatalogProduct) {
  return [...(product.media?.images ?? [])].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function getPrimaryProductImage(product: CatalogProduct) {
  if (!product.media) return null;
  return product.media.images.find(({ id }) => id === product.media?.primaryImageId) ?? null;
}

export function toDisplayPrice(price: CatalogPrice | null): ProductPrice | null {
  if (!price) return null;

  return {
    amount: {
      amountMinor: price.amountMinor,
      currency: price.currency,
    },
    label: price.label,
  };
}

export function getLocalizedProductContent(
  product: CatalogProduct,
  language: SupportedLanguage = 'en'
) {
  const localized = product.content[language];
  return localized.status === 'approved' && localized.eyebrow && localized.description
    ? { eyebrow: localized.eyebrow, description: localized.description }
    : product.content.en;
}

export function toServiceCard(
  product: CatalogProduct,
  now = new Date(),
  language: SupportedLanguage = 'en'
): ServiceCardData {
  const primaryImage = getPrimaryProductImage(product);
  const content = getLocalizedProductContent(product, language);

  return {
    eyebrow: content.eyebrow,
    title: product.title,
    description: content.description,
    price: toDisplayPrice(resolveProductPrice(product, now)),
    image: primaryImage?.src,
    dark: product.cardTone === 'dark',
    warmDark: product.cardTone === 'warm',
  };
}

export function toDisplayVariant(variant: CatalogVariant, now = new Date()) {
  return {
    sku: variant.sku,
    storage: variant.storage,
    ram: variant.ram,
    network: variant.network,
    availability: variant.availability,
    price: toDisplayPrice(resolveVariantPrice(variant, now)),
  };
}
