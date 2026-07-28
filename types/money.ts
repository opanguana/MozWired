export const supportedCurrencies = ['MZN', 'USD', 'ZAR', 'EUR'] as const;

export type SupportedCurrency = (typeof supportedCurrencies)[number];

export type Money = {
  amountMinor: number;
  currency: 'MZN';
};

export type ProductPrice = {
  amount: Money;
  label: 'exact' | 'from';
};

export function mznPrice(
  amountMinor: number,
  label: ProductPrice['label'] = 'exact'
): ProductPrice {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) {
    throw new RangeError('MZN prices must use a non-negative integer number of minor units.');
  }

  return {
    amount: {
      amountMinor,
      currency: 'MZN',
    },
    label,
  };
}
