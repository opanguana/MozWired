import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { CatalogBrowser } from '@/components/catalog/CatalogBrowser';
import { catalogListingItems } from '@/data/catalog-listing';

export const metadata: Metadata = {
  title: 'All products | MozWired',
  description: 'Browse computers, smartphones, audio and accessories available from MozWired.',
};

export default function ProductsPage() {
  const heroItems = catalogListingItems.filter((item) => item.image).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#08090a] text-white">
      <section className="safe-page-padding pb-20 pt-8 md:pt-12">
        <div className="max-w-store mx-auto">
          <nav aria-label="Breadcrumb" className="mb-5 text-xs text-white/45">
            <Link href="/" className="focus-ring hover:text-white">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span>Products</span>
          </nav>
          <div className="relative min-h-[22rem] overflow-hidden border border-white/10 bg-[#111214] px-6 py-12 md:px-12">
            <div className="relative z-10 max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-store-cyan">
                MozWired store
              </p>
              <h1 className="mt-4 text-5xl font-bold leading-[0.96] tracking-[-0.055em] md:text-7xl">
                Technology for every day.
              </h1>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60 md:text-base">
                Explore computers, phones, audio and accessories selected for work, creativity and
                life in Mozambique.
              </p>
            </div>
            <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
              {heroItems.map((item, index) => (
                <div
                  key={item.slug}
                  className="absolute bottom-[-3%] h-[78%] w-[48%]"
                  style={{ right: `${index * 19}%` }}
                >
                  <Image
                    src={item.image!}
                    alt=""
                    fill
                    sizes="28vw"
                    className="object-contain drop-shadow-[0_22px_30px_rgb(0_0_0/0.55)]"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-r from-[#111214] via-[#111214]/25 to-transparent" />
            </div>
          </div>
          <div className="mt-8">
            <CatalogBrowser items={catalogListingItems} />
          </div>
        </div>
      </section>
    </main>
  );
}
