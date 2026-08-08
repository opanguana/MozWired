'use client';

import { useEffect, useState } from 'react';

import { useCurrency } from '@/components/currency/CurrencyProvider';
import { ProductPrice } from '@/components/currency/ProductPrice';
import type { toDisplayVariant } from '@/catalog/presentation';
import { formatProductPrice } from '@/lib/money';
import { cn } from '@/lib/utils';
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';

type DisplayVariant = ReturnType<typeof toDisplayVariant>;

const availabilityLabels: Record<NonNullable<DisplayVariant['availability']>, string> = {
  in_stock: 'In stock',
  low_stock: 'Low stock',
  out_of_stock: 'Out of stock',
  preorder: 'Available for preorder',
  discontinued: 'Discontinued',
  price_on_request: 'Price on request',
};

function availabilityLabel(availability: DisplayVariant['availability']) {
  return availability ? availabilityLabels[availability] : 'Contact us for availability';
}

export function ProductVariantSelector({
  productTitle,
  productName,
  productPath,
  variants,
}: {
  productTitle: string;
  productName: string;
  productPath: string;
  variants: DisplayVariant[];
}) {
  const { currency } = useCurrency();
  const [selectedSku, setSelectedSku] = useState(variants[0]?.sku ?? '');
  const [productUrl, setProductUrl] = useState(productPath);
  const selected = variants.find(({ sku }) => sku === selectedSku) ?? variants[0];

  useEffect(() => {
    setProductUrl(window.location.href);
  }, []);

  if (!selected) return null;

  const configuration = [
    selected.storage,
    selected.ram ? `${selected.ram} RAM` : null,
    selected.network,
    selected.specifications?.processor,
    selected.specifications?.display,
    selected.specifications?.operatingSystem,
    selected.specifications?.graphics,
  ]
    .filter(Boolean)
    .join(' · ');
  const specialistUrl = buildWhatsAppUrl(
    buildProductWhatsAppMessage({
      productName,
      displayedPrice: formatProductPrice(selected.price, currency).text,
      sku: selected.sku,
      configuration,
      availability: availabilityLabel(selected.availability),
      productUrl,
    })
  );

  return (
    <>
      <fieldset className="mt-6 grid gap-3">
        <legend className="sr-only">{productTitle} available configurations</legend>
        {variants.map((variant) => {
          const specs = variant.specifications;
          const selectedVariant = variant.sku === selected.sku;

          return (
            <label
              key={variant.sku}
              className={cn(
                'grid cursor-pointer gap-3 rounded-xl border bg-black/20 px-4 py-3 transition sm:grid-cols-[1fr_auto] sm:items-center',
                selectedVariant
                  ? 'border-store-cyan ring-1 ring-store-cyan'
                  : 'border-white/30 hover:border-white/60'
              )}
            >
              <input
                type="radio"
                name="configuration"
                value={variant.sku}
                checked={selectedVariant}
                onChange={() => setSelectedSku(variant.sku)}
                className="sr-only"
              />
              <span>
                <span className="block text-sm font-semibold">
                  {[
                    variant.storage,
                    variant.ram ? `${variant.ram} RAM` : null,
                    variant.network,
                    specs?.processor,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-white/60">
                  {[specs?.display, specs?.operatingSystem, specs?.graphics]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
                <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/55">
                  <span>{availabilityLabel(variant.availability)}</span>
                  <span>SKU: {variant.sku}</span>
                </span>
              </span>
              <ProductPrice
                price={variant.price}
                className="shrink-0 text-left text-xs font-semibold sm:text-right"
              />
            </label>
          );
        })}
      </fieldset>

      <div className="mt-8 border-t border-white/15 pt-6" aria-live="polite">
        <p className="text-xs text-white/55">Selected configuration · {selected.sku}</p>
        <ProductPrice price={selected.price} className="mt-1 text-xl font-bold" />
        <a
          href={specialistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-store-cyan"
        >
          Talk to a specialist
        </a>
      </div>
    </>
  );
}
