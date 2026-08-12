import { PackageOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { CatalogListingItem } from '@/catalog/listing';
import { ProductPrice } from '@/components/currency/ProductPrice';
import { BrandMark } from '@/components/store/BrandMark';

const availabilityLabels: Record<string, string> = {
  in_stock: 'In stock',
  preorder: 'Pre-order',
  backorder: 'Backorder',
  contact: 'Contact for availability',
  out_of_stock: 'Out of stock',
};

export function CatalogCard({ item }: { item: CatalogListingItem }) {
  const availability = item.availability
    .map((value) => availabilityLabels[value ?? ''])
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="group relative flex min-h-[25rem] flex-col border border-white/10 bg-[#151517] p-4 text-white transition-colors hover:border-white/30 focus-within:border-store-cyan">
      <Link
        href={item.href}
        aria-label={`View ${item.title} details`}
        className="focus-ring absolute inset-0 z-10"
      />
      <div className="mb-3 flex min-h-5 items-start justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-store-teal">
          {availability || 'View product'}
        </p>
        <BrandMark brand={item.brand} inverse />
      </div>
      <div className="relative h-52 overflow-hidden bg-[#eeeeef]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, 85vw"
            className="scale-[0.9] object-contain transition-transform duration-300 group-hover:scale-[0.94]"
          />
        ) : (
          <div
            role="img"
            aria-label={`${item.title} product image coming soon`}
            className="flex h-full items-center justify-center text-black/40"
          >
            <PackageOpen aria-hidden="true" className="size-16 stroke-1" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
          {item.category}
        </p>
        <h2 className="mt-1 text-lg font-bold leading-tight tracking-[-0.025em]">{item.title}</h2>
        {item.specification && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/55">
            {item.specification}
          </p>
        )}
        <ProductPrice price={item.price} className="mt-auto pt-4 text-sm font-semibold" />
      </div>
    </article>
  );
}
