import Image from 'next/image';
import Link from 'next/link';

import { CardCarousel } from '@/components/store/CardCarousel';
import { CategoryRail } from '@/components/store/CategoryRail';
import type { ServiceCardData } from '@/components/store/ServiceCard';
import { storeConfig } from '@/config/store';
import { products } from '@/data/products';
import { buildSmartphoneCards } from '@/data/smartphones';

const samsungSmartphones = buildSmartphoneCards('Samsung');
const appleSmartphones = buildSmartphoneCards('Apple');

const storeCollections: {
  id: string;
  highlight: string;
  title: string;
  cards: ServiceCardData[];
}[] = [
  {
    id: 'services',
    highlight: 'Limited-time offers.',
    title: 'Major must-haves.',
    cards: [products.macbookAir, products.macbookPro, products.ipadAir, products.iphone],
  },
  {
    id: 'favorites',
    highlight: 'Samsung Galaxy.',
    title: 'Smartphones for every budget.',
    cards: samsungSmartphones,
  },
  {
    id: 'savings',
    highlight: 'More ways to save.',
    title: 'Great technology at the right price.',
    cards: [products.giftCard, products.iphoneValue, products.ipadMini, products.airpods],
  },
  {
    id: 'benefits',
    highlight: 'The MozWired Store difference.',
    title: 'More reasons to shop with us.',
    cards: [products.imac, products.macMini, products.giftCard, products.airpodsPro],
  },
  {
    id: 'accessories',
    highlight: 'Accessories.',
    title: 'The finishing touches for every setup.',
    cards: [products.accessories, products.airpodsPro, products.airtag, products.homepod],
  },
  {
    id: 'possibilities',
    highlight: 'Endless possibilities.',
    title: 'Technology for work, creativity, and play.',
    cards: [products.ipadPro, products.macbookAir, products.iphonePro, products.appleTV],
  },
  {
    id: 'more-to-love',
    highlight: 'Apple iPhone.',
    title: 'Find the model that fits.',
    cards: appleSmartphones,
  },
  {
    id: 'experience',
    highlight: 'The MozWired experience.',
    title: 'Electronics that work beautifully together.',
    cards: [products.visionPro, products.appleTV, products.homepod, products.giftCard],
  },
];

function CardCollection({
  id,
  highlight,
  title,
  cards,
  darkHeading = false,
}: {
  id: string;
  highlight: string;
  title: string;
  cards: ServiceCardData[];
  darkHeading?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-7 md:py-10" aria-labelledby={`${id}-title`}>
      <h2
        id={`${id}-title`}
        className={`mx-auto max-w-store px-5 text-2xl font-bold tracking-[-0.04em] md:px-8 md:text-[1.75rem] ${
          darkHeading ? 'text-white' : 'text-store-ink'
        }`}
      >
        <span className={`marker-highlight ${darkHeading ? 'text-black' : ''}`}>{highlight}</span>{' '}
        <span className={darkHeading ? 'text-white/55' : 'text-black/55'}>{title}</span>
      </h2>
      <CardCarousel cards={cards} label={`${highlight} ${title}`} fullBleed={cards.length > 4} />
    </section>
  );
}

export default function HomePage() {
  const [featuredCollection, ...remainingCollections] = storeCollections;

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
          <div className="mx-auto grid min-h-[14rem] max-w-store items-center gap-8 px-5 py-8 md:min-h-[16rem] md:grid-cols-[1fr_auto] md:px-8">
            <div>
              <h1 className="text-[clamp(3rem,5vw,4rem)] font-medium leading-none tracking-[-0.045em]">
                Your Trusted <span className="bg-[#f15a24] px-[0.06em] text-white">Store</span>
              </h1>
            </div>

            <div className="md:min-w-60 md:text-right">
              <p className="text-[1.75rem] font-normal leading-none tracking-[-0.035em]">
                Life, sorted.
              </p>
              <div className="mt-4 grid justify-items-start gap-2 text-[13px] md:justify-items-end">
                <Link
                  href="#support"
                  className="rounded-sm text-[rgb(247_248_248)] hover:underline focus-ring"
                >
                  Connect with a Specialist ↗
                </Link>
                <Link
                  href="#services"
                  className="rounded-sm text-[rgb(139_143_152)] transition hover:text-[rgb(247_248_248)] hover:underline focus-ring"
                >
                  Find a MozWired Store ↗
                </Link>
              </div>
            </div>
          </div>

          {storeConfig.showCategoryRail && <CategoryRail />}
          <CardCollection {...featuredCollection} darkHeading />
        </div>
      </section>

      <div className="bg-store-canvas">
        {remainingCollections.map((collection) => (
          <CardCollection key={collection.id} {...collection} />
        ))}
      </div>
    </main>
  );
}
