import type { CatalogPrice, CatalogProduct, CatalogVariant } from './schema';

function isPriceActive(price: CatalogPrice, now: Date) {
  const timestamp = now.getTime();
  const begins = price.effectiveFrom ? Date.parse(price.effectiveFrom) : null;
  const ends = price.effectiveUntil ? Date.parse(price.effectiveUntil) : null;

  return (begins === null || timestamp >= begins) && (ends === null || timestamp < ends);
}

export function resolveScheduledPrice(
  basePrice: CatalogPrice | null,
  scheduledPrices: CatalogPrice[],
  now = new Date()
) {
  return scheduledPrices.find((price) => isPriceActive(price, now)) ?? basePrice;
}

export function resolveVariantPrice(variant: CatalogVariant, now = new Date()) {
  return resolveScheduledPrice(variant.pricing, variant.scheduledPrices, now);
}

export function resolveProductPrice(product: CatalogProduct, now = new Date()) {
  const directPrice = resolveScheduledPrice(product.pricing, product.scheduledPrices, now);
  if (directPrice) return directPrice;

  const variantPrices = product.variants
    .filter(({ status }) => status === 'active')
    .map((variant) => resolveVariantPrice(variant, now))
    .filter((price): price is CatalogPrice => Boolean(price));

  if (!variantPrices.length) return null;

  const lowestAmount = Math.min(...variantPrices.map(({ amountMinor }) => amountMinor));
  const distinctAmounts = new Set(variantPrices.map(({ amountMinor }) => amountMinor));

  return {
    currency: 'MZN' as const,
    amountMinor: lowestAmount,
    label: distinctAmounts.size > 1 ? ('from' as const) : ('exact' as const),
    vatIncluded: false as const,
    effectiveFrom: null,
    effectiveUntil: null,
  };
}
