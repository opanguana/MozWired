import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductPrice } from '@/components/currency/ProductPrice';
import { ProductGallery } from '@/components/store/ProductGallery';
import { getProductImages } from '@/catalog/presentation';
import { catalogProducts, getCatalogProduct } from '@/data/catalog';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

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
  const images = getProductImages(product.product);

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
          href="/"
          scroll
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
          <ProductPrice price={card.price} className="mt-4 text-base font-medium text-white/80" />
        </div>

        <div className="mt-16 grid gap-8 md:mt-24 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-12">
          <ProductGallery
            images={images}
            productTitle={card.title}
            description={card.description}
          />

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
                {variants.map(
                  ({
                    sku,
                    network,
                    storage,
                    ram,
                    price,
                    warranty,
                    condition,
                    specifications,
                    promotion,
                  }) => (
                    <li
                      key={sku}
                      className="grid min-h-16 gap-3 rounded-xl border border-white/30 bg-black/20 px-4 py-3 transition hover:border-store-cyan sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div>
                        <span className="text-sm font-semibold">
                          {[storage, ram ? `${ram} RAM` : null, network, specifications?.processor]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/55">
                          {condition && (
                            <span>
                              {condition === 'refurbished' ? 'Refurbished' : 'New condition'}
                            </span>
                          )}
                          {promotion && <span className="text-store-orange">Promotion</span>}
                          {warranty && <span>Warranty: {warranty.sourceLabel}</span>}
                        </div>
                      </div>
                      <ProductPrice
                        price={price}
                        className="shrink-0 text-right text-xs font-semibold"
                      />
                    </li>
                  )
                )}
              </ul>
            )}

            <div className="mt-8 border-t border-white/15 pt-6">
              <ProductPrice price={card.price} className="text-xl font-bold" />
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
