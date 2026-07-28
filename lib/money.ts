import { currencyConfig } from '@/config/currencies';
import type { ProductPrice, SupportedCurrency } from '@/types/money';

const currencyFormatting: Record<
  SupportedCurrency,
  { locale: string; fractionDigits: number }
> = {
  MZN: { locale: 'en-MZ', fractionDigits: 0 },
  USD: { locale: 'en-US', fractionDigits: 2 },
  ZAR: { locale: 'en-ZA', fractionDigits: 0 },
  EUR: { locale: 'en-IE', fractionDigits: 2 },
};

export type FormattedProductPrice = {
  text: string;
  approximate: boolean;
};

function assertMinorUnits(value: number) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError('Money amounts must use non-negative integer minor units.');
  }
}

function divideAndRound(numerator: bigint, denominator: bigint) {
  return (numerator + denominator / BigInt(2)) / denominator;
}

export function convertMznMinor(
  amountMinor: number,
  targetCurrency: SupportedCurrency
): number {
  assertMinorUnits(amountMinor);
  if (targetCurrency === 'MZN') return amountMinor;

  const rate = currencyConfig.mznMinorPerForeignMajor[targetCurrency];
  const convertedMinor = divideAndRound(BigInt(amountMinor) * BigInt(100), BigInt(rate));
  const converted = Number(convertedMinor);

  if (!Number.isSafeInteger(converted)) {
    throw new RangeError('Converted money amount exceeds the supported integer range.');
  }

  if (targetCurrency === 'ZAR') {
    return Math.round(converted / 100) * 100;
  }

  return converted;
}

export function formatMinorUnits(
  amountMinor: number,
  currency: SupportedCurrency
): string {
  assertMinorUnits(amountMinor);
  const { locale, fractionDigits } = currencyFormatting[currency];

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountMinor / 100);
}

export function formatProductPrice(
  price: ProductPrice | null,
  targetCurrency: SupportedCurrency
): FormattedProductPrice {
  if (!price) {
    return {
      text: 'Contact for MZN price',
      approximate: false,
    };
  }

  const convertedMinor = convertMznMinor(price.amount.amountMinor, targetCurrency);
  const formatted = formatMinorUnits(convertedMinor, targetCurrency);
  const label = price.label === 'from' ? 'From ' : '';
  const approximate = targetCurrency !== currencyConfig.baseCurrency;

  return {
    text: `${approximate ? 'Approx. ' : ''}${label}${formatted}`,
    approximate,
  };
}
