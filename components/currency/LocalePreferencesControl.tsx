'use client';

import { ChevronDown, Globe2, X } from 'lucide-react';
import {
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
  useId,
  useRef,
  useState,
} from 'react';

import { currencyConfig } from '@/config/currencies';
import { localeConfig } from '@/config/locales';
import { recommendedCurrencyForMarket } from '@/lib/locale-preferences';
import type { LocalePreferences, MarketCode, SupportedLanguage } from '@/types/locale';
import type { SupportedCurrency } from '@/types/money';

import { useCurrency } from './CurrencyProvider';

export function LocalePreferencesControl({ compact = false }: { compact?: boolean }) {
  const { language, market, currency, setPreferences } = useCurrency();
  const [draft, setDraft] = useState<LocalePreferences>({
    language,
    market,
    currency,
  });
  const [announcement, setAnnouncement] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const languageId = useId();
  const marketId = useId();
  const currencyId = useId();
  const recommendation = recommendedCurrencyForMarket(draft.market);

  function openDialog() {
    setDraft({ language, market, currency });
    setAnnouncement('');
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    requestAnimationFrame(() => languageRef.current?.focus());
  }

  function closeDialog() {
    const dialog = dialogRef.current;
    if (dialog?.open && typeof dialog.close === 'function') dialog.close();
    else dialog?.removeAttribute('open');
    triggerRef.current?.focus();
  }

  function cancelDialog(event?: SyntheticEvent<HTMLDialogElement>) {
    event?.preventDefault();
    closeDialog();
  }

  function handleBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) cancelDialog();
  }

  function applyPreferences() {
    setPreferences(draft);
    setAnnouncement(
      `Preferences applied: ${draft.language === 'pt-MZ' ? 'PT' : draft.language.toUpperCase()}, ${draft.market}, ${draft.currency}.`
    );
    closeDialog();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Language, country and currency settings"
        aria-haspopup="dialog"
        onClick={openDialog}
        className="focus-ring inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 text-[11px] font-semibold text-white transition hover:bg-white/[0.11]"
      >
        <Globe2 aria-hidden="true" className="size-3.5" />
        <span>{language === 'pt-MZ' ? 'PT' : language.toUpperCase()}</span>
        {!compact && (
          <>
            <span aria-hidden="true" className="hidden text-white/35 lg:inline">
              ·
            </span>
            <span className="hidden lg:inline">{market}</span>
          </>
        )}
        <span aria-hidden="true" className="text-white/35">
          ·
        </span>
        <span>{currency}</span>
        <ChevronDown aria-hidden="true" className="size-3 text-white/45" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={cancelDialog}
        onClick={handleBackdrop}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-[#111315]/95 p-0 text-white shadow-2xl backdrop:bg-black/65 backdrop:backdrop-blur-sm"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-xl font-semibold tracking-[-0.025em]">
                Language, country and currency
              </h2>
              <p id={descriptionId} className="mt-2 text-xs leading-relaxed text-white/55">
                Shopping location is a display preference, not a shipping or availability guarantee.
              </p>
            </div>
            <button
              type="button"
              onClick={() => cancelDialog()}
              className="icon-button shrink-0"
              aria-label="Cancel preference changes"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-5">
            <PreferenceField
              controlId={languageId}
              label="Language"
              description="Portuguese support is in preparation; untranslated content remains in English."
            >
              <select
                id={languageId}
                aria-describedby={`${languageId}-description`}
                ref={languageRef}
                value={draft.language}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    language: event.target.value as SupportedLanguage,
                  }))
                }
                className="focus-ring min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm"
              >
                {localeConfig.languages.map((option) => (
                  <option key={option.code} value={option.code} className="bg-[#171719]">
                    {option.label}
                    {!option.complete ? ' — translation in progress' : ''}
                  </option>
                ))}
              </select>
            </PreferenceField>

            <PreferenceField
              controlId={marketId}
              label="Shopping country or market"
              description="This does not change delivery eligibility, stock, taxes or catalogue prices."
            >
              <select
                id={marketId}
                aria-describedby={`${marketId}-description`}
                value={draft.market}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    market: event.target.value as MarketCode,
                  }))
                }
                className="focus-ring min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm"
              >
                {localeConfig.markets.map((option) => (
                  <option key={option.code} value={option.code} className="bg-[#171719]">
                    {option.label}
                  </option>
                ))}
              </select>
              {draft.currency !== recommendation && (
                <p className="mt-2 text-xs text-white/55">
                  {recommendation} is commonly used for this market.{' '}
                  <button
                    type="button"
                    className="focus-ring rounded-sm text-store-cyan hover:underline"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        currency: recommendation,
                      }))
                    }
                  >
                    Use {recommendation}
                  </button>
                </p>
              )}
            </PreferenceField>

            <PreferenceField
              controlId={currencyId}
              label="Display currency"
              description={`MZN is authoritative. Other currencies are estimates, prices exclude VAT, and rates were updated ${new Date(
                currencyConfig.ratesUpdatedAt
              ).toLocaleDateString('en-MZ')}.`}
            >
              <select
                id={currencyId}
                aria-describedby={`${currencyId}-description`}
                value={draft.currency}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    currency: event.target.value as SupportedCurrency,
                  }))
                }
                className="focus-ring min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 text-sm"
              >
                {currencyConfig.supportedCurrencies.map((option) => (
                  <option key={option} value={option} className="bg-[#171719]">
                    {option}
                    {option === 'MZN' ? ' — base currency' : ' — approximate'}
                  </option>
                ))}
              </select>
            </PreferenceField>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => cancelDialog()}
              className="focus-ring min-h-11 rounded-full border border-white/20 px-5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.07] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyPreferences}
              className="focus-ring min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-store-cyan"
            >
              Apply preferences
            </button>
          </div>
        </div>
      </dialog>

      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}

function PreferenceField({
  controlId,
  label,
  description,
  children,
}: {
  controlId: string;
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={controlId} className="block text-sm font-semibold">
        {label}
      </label>
      <p
        id={`${controlId}-description`}
        className="mb-2 mt-1 text-[11px] leading-relaxed text-white/45"
      >
        {description}
      </p>
      {children}
    </div>
  );
}
