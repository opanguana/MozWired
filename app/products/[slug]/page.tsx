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
    <main
      id="main-content"
      className="relative isolate min-h-screen overflow-hidden bg-[#08090a] text-[rgb(247_248_248)]"
    >
      <Image
        src="/images/store/store-hero-glow.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-bottom"
        aria-hidden="true"
      />

      <section className="mx-auto max-w-[100rem] px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16">
        <Link
          href="/#services"
          className="focus-ring inline-flex rounded-sm text-sm font-semibold text-store-cyan hover:underline"
        >
          ← Back to the store
        </Link>

        <div className="mt-10 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-store-cyan">
            {card.eyebrow}
          </p>
          <h1 className="mt-2 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none tracking-[-0.055em]">
            Buy {card.title}
          </h1>
          <p className="mt-4 text-base font-medium text-white/80">{card.price}</p>
        </div>

        <div className="mt-16 grid gap-8 md:mt-24 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-12">
          <div className="relative min-h-[30rem] overflow-hidden rounded-2xl bg-[#f5f5f7]/95 text-store-ink shadow-2xl shadow-black/25 md:min-h-[46rem]">
            <p className="relative z-[1] max-w-md p-6 text-sm font-semibold leading-relaxed text-black/60 md:p-8">
              {card.description}
            </p>
            {card.image ? (
              <Image
                src={card.image}
                alt={card.title}
                fill
                priority
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="object-contain px-8 pb-8 pt-20 md:px-14 md:pb-14 md:pt-24"
              />
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 pt-16 text-center"
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

          <aside className="rounded-2xl border border-white/10 bg-black/35 p-6 shadow-xl shadow-black/15 backdrop-blur-md md:p-8">
            <h2 className="text-2xl font-bold tracking-[-0.035em]">
              {variants.length ? (
                <>
                  Model. <span className="text-white/55">Choose your configuration.</span>
                </>
              ) : (
                <>
                  Product. <span className="text-white/55">Review the details.</span>
                </>
              )}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{card.description}</p>

            {variants.length > 0 && (
              <ul className="mt-6 grid gap-3" aria-label={`${card.title} available configurations`}>
                {variants.map(({ network, storage, ram, priceMzn }) => (
                  <li
                    key={`${storage}-${ram ?? 'standard'}-${priceMzn}`}
                    className="flex min-h-16 items-center justify-between gap-5 rounded-xl border border-white/30 bg-black/20 px-4 py-3 transition hover:border-store-cyan"
                  >
                    <span className="text-sm font-semibold">
                      {[storage, ram ? `${ram} RAM` : null, network].filter(Boolean).join(' · ')}
                    </span>
                    <span className="shrink-0 text-xs font-semibold">{formatMzn(priceMzn)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="text-xl font-bold">{card.price}</p>
              <Link
                href="/#support"
                className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-store-cyan"
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
