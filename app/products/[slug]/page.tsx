import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { ProductPrice } from '@/components/currency/ProductPrice';
import { ProductGallery } from '@/components/store/ProductGallery';
import { ProductVariantSelector } from '@/components/store/ProductVariantSelector';
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
  const { slug } = await params;
  const product = getCatalogProduct(slug);
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

      <section className="safe-page-padding mx-auto max-w-[100rem] pb-16 pt-10 md:pb-24 md:pt-16">
        <div className="max-w-3xl">
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none tracking-[-0.055em]">
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

            <ProductVariantSelector
              productTitle={card.title}
              productName={`${product.brand} ${card.title}`}
              productPath={`/products/${slug}`}
              variants={variants}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
