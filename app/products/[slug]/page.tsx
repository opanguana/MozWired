import { Smartphone } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { catalogProducts, getCatalogProduct } from '@/data/catalog';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

const formatMzn = (value: number) => `${new Intl.NumberFormat('en-US').format(value)} MZN`;

export function generateStaticParams() {
  return catalogProducts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getCatalogProduct((await params).slug);

  return product
    ? {
        title: `Buy ${product.card.title} | MozWired`,
        description: product.card.description,
      }
    : {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getCatalogProduct((await params).slug);
  if (!product) notFound();

  const { card, variants } = product;

  return (
    <main id="main-content" className="min-h-screen bg-white text-store-ink">
      <section className="mx-auto max-w-store px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
        <Link
          href="/#services"
          className="focus-ring inline-flex rounded-sm text-sm font-semibold text-store-teal hover:underline"
        >
          ← Back to the store
        </Link>

        <div className="mt-10 flex flex-col justify-between gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-store-teal">
              {card.eyebrow}
            </p>
            <h1 className="mt-2 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none tracking-[-0.055em]">
              Buy {card.title}
            </h1>
          </div>
          <p className="max-w-xs text-sm font-semibold md:text-right">{card.price}</p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div className="relative min-h-[28rem] overflow-hidden bg-[#f5f5f7] md:min-h-[38rem]">
            {card.image ? (
              <Image
                src={card.image}
                alt={card.title}
                fill
                priority
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="object-contain p-8 md:p-14"
              />
            ) : (
              <div
                className="flex min-h-[28rem] flex-col items-center justify-center gap-5 px-8 text-center md:min-h-[38rem]"
                role="img"
                aria-label={`${card.title} product image coming soon`}
              >
                <Smartphone aria-hidden="true" className="size-32 stroke-[0.9]" />
                <p className="font-semibold">{card.title}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-black/45">
                  Image coming soon
                </p>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28">
            <h2 className="text-2xl font-bold tracking-[-0.035em]">
              {variants.length ? 'Choose your configuration.' : 'Product details.'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-black/60">{card.description}</p>

            {variants.length > 0 && (
              <ul className="mt-6 grid gap-3" aria-label={`${card.title} available configurations`}>
                {variants.map(({ network, storage, ram, priceMzn }) => (
                  <li
                    key={`${storage}-${ram ?? 'standard'}-${priceMzn}`}
                    className="flex min-h-16 items-center justify-between gap-5 rounded-xl border border-black/20 px-4 py-3"
                  >
                    <span className="text-sm font-semibold">
                      {[storage, ram ? `${ram} RAM` : null, network].filter(Boolean).join(' · ')}
                    </span>
                    <span className="shrink-0 text-xs font-semibold">{formatMzn(priceMzn)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="text-xl font-bold">{card.price}</p>
              <Link
                href="/#support"
                className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-store-teal"
              >
                Talk to a specialist
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
