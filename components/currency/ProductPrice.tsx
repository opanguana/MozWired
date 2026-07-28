'use client';

import { formatProductPrice } from '@/lib/money';
import { cn } from '@/lib/utils';
import type { ProductPrice as ProductPriceValue } from '@/types/money';

import { useCurrency } from './CurrencyProvider';

export function ProductPrice({
  price,
  className,
  showVat = true,
}: {
  price: ProductPriceValue | null;
  className?: string;
  showVat?: boolean;
}) {
  const { currency } = useCurrency();
  const formatted = formatProductPrice(price, currency);

  return (
    <span className={cn('inline-flex flex-wrap items-baseline gap-x-1.5', className)}>
      <span>{formatted.text}</span>
      {price && showVat && <span className="opacity-65">excl. VAT</span>}
    </span>
  );
}
