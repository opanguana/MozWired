import Image from 'next/image';
import Link from 'next/link';

import { CardCarousel } from '@/components/store/CardCarousel';
import { CategoryRail } from '@/components/store/CategoryRail';
import type { ServiceCardData } from '@/components/store/ServiceCard';
import { getProductsForSection } from '@/catalog/load';
import { toServiceCard } from '@/catalog/presentation';
import { storeConfig } from '@/config/store';

const storeCollections: {
  id: string;
  highlight: string;
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  cards: ServiceCardData[];
  fullBleed?: boolean;
}[] = [
  {
    id: 'services',
    highlight: 'Computers.',
    title: 'Find the configuration that fits.',
    viewAllHref: '/products?category=computers',
    viewAllLabel: 'View all computers',
    cards: getProductsForSection('services').map((product) => toServiceCard(product)),
  },
  {
    id: 'favorites',
    highlight: 'Smartphones.',
    title: 'Smartphones for every budget.',
    viewAllHref: '/products?category=phones',
    viewAllLabel: 'View all smartphones',
    cards: getProductsForSection('favorites').map((product) => toServiceCard(product)),
  },
  {
    id: 'accessories',
    highlight: 'Accessories.',
    title: 'The finishing touches for every setup.',
    viewAllHref: '/products?category=accessories',
    viewAllLabel: 'View all accessories',
    cards: getProductsForSection('accessories').map((product) => toServiceCard(product)),
    fullBleed: true,
  },
  {
    id: 'possibilities',
    highlight: 'Endless possibilities.',
    title: 'Technology for work, creativity, and play.',
    viewAllHref: '/products?category=computers',
    viewAllLabel: 'View all endless possibilities products',
    cards: getProductsForSection('possibilities').map((product) => toServiceCard(product)),
  },
];

function CardCollection({
  id,
  highlight,
  title,
  viewAllHref,
  viewAllLabel,
  cards,
  fullBleed = false,
  darkHeading = false,
}: {
  id: string;
  highlight: string;
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  cards: ServiceCardData[];
  fullBleed?: boolean;
  darkHeading?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-7 md:py-10" aria-labelledby={`${id}-title`}>
      <div
        className="safe-page-padding mx-auto flex max-w-store flex-wrap items-start gap-x-6 gap-y-2"
        data-collection-header
      >
        <h2
          id={`${id}-title`}
          className={`min-w-[min(100%,20rem)] flex-1 text-2xl font-bold tracking-[-0.04em] md:text-[1.75rem] ${
            darkHeading ? 'text-white' : 'text-store-ink'
          }`}
        >
          <span
            className="flex flex-wrap items-baseline gap-x-[0.25em] gap-y-1 leading-tight"
            data-collection-heading-content
          >
            <span className={`marker-highlight ${darkHeading ? 'text-black' : ''}`}>
              {highlight}
            </span>
            <span className={darkHeading ? 'text-white/55' : 'text-black/55'}>{title}</span>
          </span>
        </h2>
        <Link
          href={viewAllHref}
          aria-label={viewAllLabel}
          data-collection-view-all
          data-contrast={darkHeading ? 'light' : 'dark'}
          className={`focus-ring ml-auto inline-flex min-h-11 shrink-0 items-center rounded-sm px-1 text-sm font-medium transition hover:underline ${
            darkHeading
              ? 'text-white/65 visited:text-white/65 hover:text-white'
              : 'text-black/65 visited:text-black/65 hover:text-black'
          }`}
        >
          View all →
        </Link>
      </div>
      <CardCarousel
        cards={cards}
        label={`${highlight} ${title}`}
        fullBleed={fullBleed || cards.length > 4}
      />
    </section>
  );
}

export default function HomePage() {
  const activeCollections = storeCollections.filter(({ cards }) => cards.length > 0);
  const featuredCollection = activeCollections.find(({ id }) => id === 'services');
  const backgroundCollections = activeCollections.filter(({ id }) =>
    ['favorites', 'accessories'].includes(id)
  );
  const middleCollections = activeCollections.filter(({ id }) => id === 'possibilities');

  return (
    <main id="main-content">
      <section id="store" className="store-hero-copy relative isolate overflow-hidden bg-[#08090a]">
        <Image
          src="/images/store/store-hero-glow.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-bottom"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="safe-page-padding mx-auto grid min-h-[14rem] max-w-store items-center gap-8 py-8 md:min-h-[16rem] md:grid-cols-[1fr_auto]">
            <div>
              <h1 className="text-[clamp(2.5rem,12vw,3rem)] font-bold leading-[0.98] tracking-[-0.045em] sm:text-[clamp(3rem,5vw,4rem)] sm:leading-none">
                Your Trusted
                {' '}
                <span className="mt-2 block w-fit bg-[#f15a24] px-[0.06em] text-white sm:ml-[0.12em] sm:mt-0 sm:inline">
                  Partner.
                </span>
              </h1>
            </div>

            <div className="md:min-w-60 md:text-right">
              <p className="text-[1.75rem] font-normal leading-none tracking-[-0.035em]">
                Technology, sorted.
              </p>
              <div className="mt-4 grid justify-items-start gap-2 text-[13px] md:justify-items-end">
                <Link
                  href="#support"
                  className="rounded-sm text-[rgb(247_248_248)] hover:underline focus-ring"
                >
                  Get expert buying advice ↗
                </Link>
                <Link
                  href="/products"
                  className="rounded-sm text-[rgb(139_143_152)] transition hover:text-[rgb(247_248_248)] hover:underline focus-ring"
                >
                  Shop all electronics ↗
                </Link>
              </div>
            </div>
          </div>

          {storeConfig.showCategoryRail && <CategoryRail />}
          {featuredCollection && <CardCollection {...featuredCollection} darkHeading />}
        </div>
      </section>

      <div className="bg-store-canvas">
        <div className="relative isolate overflow-hidden bg-[#111315]">
          <Image
            src="/images/store/store-section-2.avif"
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover"
            aria-hidden="true"
          />
          {backgroundCollections.map((collection) => (
            <CardCollection key={collection.id} {...collection} darkHeading />
          ))}
        </div>

        {middleCollections.map((collection) => (
          <div
            key={collection.id}
            className="relative isolate overflow-hidden bg-[#08090a]"
            data-section-background="store-hero"
          >
            <Image
              src="/images/store/store-hero-glow.webp"
              alt=""
              fill
              sizes="100vw"
              className="-z-10 object-cover object-bottom"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <CardCollection {...collection} darkHeading />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
