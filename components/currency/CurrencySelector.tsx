'use client';

import { currencyConfig } from '@/config/currencies';
import type { SupportedCurrency } from '@/types/money';

import { useCurrency } from './CurrencyProvider';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="relative">
      <label htmlFor="store-currency" className="sr-only">
        Display currency
      </label>
      <select
        id="store-currency"
        aria-describedby="store-currency-note"
        value={currency}
        onChange={(event) => setCurrency(event.target.value as SupportedCurrency)}
        className="focus-ring h-8 rounded-full border border-white/15 bg-white/[0.06] px-2 text-[11px] font-semibold text-white"
        title={`Converted prices are estimates. Prices exclude VAT. Rates updated ${currencyConfig.ratesUpdatedAt.slice(0, 10)}.`}
      >
        {currencyConfig.supportedCurrencies.map((currencyCode) => (
          <option key={currencyCode} value={currencyCode} className="bg-[#171719] text-white">
            {currencyCode}
          </option>
        ))}
      </select>
      <span id="store-currency-note" className="sr-only">
        MZN is the base currency. Converted prices are estimates using Banco de Moçambique rates
        updated {new Date(currencyConfig.ratesUpdatedAt).toLocaleDateString('en-MZ')}. Prices
        exclude VAT.
      </span>
    </div>
  );
}
