import { BadgePercent } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

export type ServiceCardData = {
  eyebrow: string;
  title: string;
  description: string;
  price: string;
  image: string;
  dark?: boolean;
  accent?: boolean;
};

export function ServiceCard({ card }: { card: ServiceCardData }) {
  return (
    <article
      className={cn(
        'flex min-h-[31rem] w-[18.5rem] shrink-0 snap-start flex-col overflow-hidden p-4 md:w-[20rem]',
        card.dark ? 'bg-black text-white' : 'bg-[#e9e9ec] text-store-ink',
        card.accent && 'bg-white'
      )}
    >
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
          card.dark ? 'text-white/70' : 'text-black/70'
        )}
      >
        {card.description}
      </p>
      <p className={cn('mt-2 text-[11px]', card.dark ? 'text-white/55' : 'text-black/55')}>
        {card.price}
      </p>
      <div className="relative mt-auto h-48 overflow-hidden bg-white/65">
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="(min-width: 768px) 320px, 296px"
          className="object-contain"
        />
      </div>
    </article>
  );
}
