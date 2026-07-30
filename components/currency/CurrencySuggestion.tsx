'use client';

import { useEffect, useState } from 'react';

import type { SupportedCurrency } from '@/types/money';

import { useCurrency } from './CurrencyProvider';

type Suggestion = {
  country: string;
  currency: SupportedCurrency;
};

export function CurrencySuggestion() {
  const { setCurrency, preferenceReady, hasExplicitPreference } = useCurrency();
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!preferenceReady || hasExplicitPreference) return;

    const controller = new AbortController();
    void fetch('/api/market-suggestion', { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { suggestion?: Suggestion | null } | null) => {
        setSuggestion(result?.suggestion ?? null);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [preferenceReady, hasExplicitPreference]);

  if (!suggestion || dismissed || hasExplicitPreference) return null;

  return (
    <aside
      className="border-b border-white/10 bg-[#171719] px-5 py-3 text-center text-xs text-white/80"
      aria-label="Currency suggestion"
    >
      <span>
        Shopping from {suggestion.country}? Display estimated prices in {suggestion.currency}.
      </span>{' '}
      <button
        type="button"
        className="focus-ring rounded-sm font-semibold text-store-cyan hover:underline"
        onClick={() => setCurrency(suggestion.currency)}
      >
        Use {suggestion.currency}
      </button>{' '}
      <button
        type="button"
        className="focus-ring rounded-sm text-white/60 hover:text-white hover:underline"
        onClick={() => setDismissed(true)}
      >
        Keep MZN
      </button>
    </aside>
  );
}
