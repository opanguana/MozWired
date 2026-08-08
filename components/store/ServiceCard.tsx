import { BadgePercent, Smartphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ProductPrice } from '@/components/currency/ProductPrice';
import type { CatalogCategory } from '@/catalog/schema';
import { cn } from '@/lib/utils';
import { toProductSlug } from '@/lib/product-slug';
import type { ProductPrice as ProductPriceValue } from '@/types/money';

import { BrandMark } from './BrandMark';

export const SHOW_PRODUCT_STATUS_LABELS = false;

export type ServiceCardData = {
  href?: string;
  brand?: string;
  category?: CatalogCategory;
  eyebrow: string;
  title: string;
  description: string;
  price: ProductPriceValue | null;
  image?: string;
  condition?: 'new' | 'refurbished' | null;
  promotion?: boolean;
  dark?: boolean;
  warmDark?: boolean;
  accent?: boolean;
};

export function ServiceCard({ card }: { card: ServiceCardData }) {
  return (
    <article
      className={cn(
        'group relative flex h-[31rem] min-h-[31rem] w-[18.5rem] shrink-0 snap-start flex-col overflow-hidden p-4 md:w-[20rem]',
        card.warmDark
          ? 'border border-[#2a2821] bg-[#1b1a15] text-white shadow-[0_18px_50px_rgb(0_0_0/0.3)]'
          : card.dark
            ? 'border border-white/15 bg-[#151517] text-white'
            : 'bg-[#e9e9ec] text-store-ink',
        card.accent && 'bg-white'
      )}
    >
      <Link
        href={card.href ?? `/products/${toProductSlug(card.title)}`}
        aria-label={`View ${card.title} details`}
        className="focus-ring absolute inset-0 z-10"
      />
      <div className="mb-2 flex items-start justify-between gap-4">
        <p
          className={cn(
            'text-[10px] font-bold uppercase tracking-wide',
            card.dark || card.warmDark ? 'text-store-orange' : 'text-store-teal'
          )}
        >
          {card.eyebrow}
        </p>
        {card.brand ? (
          <BrandMark brand={card.brand} inverse={card.dark || card.warmDark} />
        ) : (
          <BadgePercent
            aria-hidden="true"
            className={
              card.warmDark
                ? 'text-store-orange'
                : card.dark
                  ? 'text-store-cyan'
                  : 'text-store-teal'
            }
            size={18}
            strokeWidth={2.2}
          />
        )}
      </div>
      <h3 className="max-w-[15rem] text-[1.35rem] font-bold leading-[1.05] tracking-[-0.03em]">
        {card.title}
      </h3>
      {SHOW_PRODUCT_STATUS_LABELS && (card.condition || card.promotion) && (
        <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Product details">
          {card.condition && (
            <span className="rounded-full border border-current/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide">
              {card.condition === 'refurbished' ? 'Refurbished' : 'New'}
            </span>
          )}
          {card.promotion && (
            <span className="rounded-full bg-store-orange px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Promotion
            </span>
          )}
        </div>
      )}
      <p
        className={cn(
          'mt-2 text-xs leading-relaxed',
          card.warmDark ? 'text-[#aaa79f]' : card.dark ? 'text-white/75' : 'text-black/70'
        )}
      >
        {card.description}
      </p>
      <ProductPrice
        price={card.price}
        className={cn(
          'mt-2 text-[11px]',
          card.warmDark ? 'text-[#8f8b82]' : card.dark ? 'text-white/65' : 'text-black/55'
        )}
      />
      <div
        className={cn(
          'relative mt-auto h-80 shrink-0 overflow-hidden',
          card.warmDark ? 'border border-[#353229] bg-[#292720]' : 'bg-white/65'
        )}
      >
        {card.image ? (
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(min-width: 768px) 320px, 296px"
            className={cn(
              'object-contain transition-transform duration-300',
              card.category === 'computers'
                ? 'scale-[0.92] group-hover:scale-[0.96]'
                : 'scale-[1.5] group-hover:scale-[1.56]'
            )}
          />
        ) : (
          <div
            className={cn(
              'flex h-full flex-col items-center justify-center gap-3 px-6 text-center',
              card.warmDark ? 'bg-[#292720] text-[#d7d4cd]' : 'bg-[#f2f2f4] text-black'
            )}
            role="img"
            aria-label={`${card.title} product image coming soon`}
          >
            <Smartphone aria-hidden="true" className="size-20 stroke-[1.1]" />
            <span className="text-xs font-semibold">{card.title}</span>
            <span
              className={cn(
                'text-[10px] uppercase tracking-[0.12em]',
                card.warmDark ? 'text-[#8f8b82]' : 'text-black/45'
              )}
            >
              Image coming soon
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
