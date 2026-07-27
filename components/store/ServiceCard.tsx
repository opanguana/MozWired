import { BadgePercent, Smartphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { toProductSlug } from '@/lib/product-slug';

export type ServiceCardData = {
  eyebrow: string;
  title: string;
  description: string;
  price: string;
  image?: string;
  dark?: boolean;
  accent?: boolean;
};

export function ServiceCard({ card }: { card: ServiceCardData }) {
  return (
    <article
      className={cn(
        'group relative flex min-h-[31rem] w-[18.5rem] shrink-0 snap-start flex-col overflow-hidden p-4 md:w-[20rem]',
        card.dark
          ? 'border border-white/15 bg-[#151517] text-white shadow-[0_18px_50px_rgb(0_0_0/0.35)]'
          : 'bg-[#e9e9ec] text-store-ink',
        card.accent && 'bg-white'
      )}
    >
      <Link
        href={`/products/${toProductSlug(card.title)}`}
        aria-label={`View ${card.title} details`}
        className="focus-ring absolute inset-0 z-10"
      />
      <div className="mb-2 flex items-start justify-between gap-4">
        <p
          className={cn(
            'text-[10px] font-bold uppercase tracking-wide',
            card.dark ? 'text-store-orange' : 'text-store-teal'
          )}
        >
          {card.eyebrow}
        </p>
        <BadgePercent
          aria-hidden="true"
          className={card.dark ? 'text-store-cyan' : 'text-store-teal'}
          size={18}
          strokeWidth={2.2}
        />
      </div>
      <h3 className="max-w-[15rem] text-[1.35rem] font-bold leading-[1.05] tracking-[-0.03em]">
        {card.title}
      </h3>
      <p
        className={cn(
          'mt-2 text-xs leading-relaxed',
          card.dark ? 'text-white/75' : 'text-black/70'
        )}
      >
        {card.description}
      </p>
      <p className={cn('mt-2 text-[11px]', card.dark ? 'text-white/65' : 'text-black/55')}>
        {card.price}
      </p>
      <div className="relative mt-auto h-48 overflow-hidden bg-white/65">
        {card.image ? (
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(min-width: 768px) 320px, 296px"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className="flex h-full flex-col items-center justify-center gap-3 bg-[#f2f2f4] px-6 text-center text-black"
            role="img"
            aria-label={`${card.title} product image coming soon`}
          >
            <Smartphone aria-hidden="true" className="size-20 stroke-[1.1]" />
            <span className="text-xs font-semibold">{card.title}</span>
            <span className="text-[10px] uppercase tracking-[0.12em] text-black/45">
              Image coming soon
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
