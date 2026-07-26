import Link from 'next/link';

import { CategoryRail } from '@/components/store/CategoryRail';
import { ServiceCard, type ServiceCardData } from '@/components/store/ServiceCard';
import { buildSmartphoneCards } from '@/data/smartphones';

const samsungSmartphones = buildSmartphoneCards('Samsung');
const appleSmartphones = buildSmartphoneCards('Apple');

const products = {
  macbookAir: {
    eyebrow: 'Customer favorite',
    title: 'MacBook Air',
    description: 'Thin, fast, and ready for work or study wherever the day takes you.',
    price: 'From $999 or $83.25/mo.',
    image: '/images/store/mac.png',
  },
  macbookPro: {
    eyebrow: 'Power to spare',
    title: 'MacBook Pro',
    description: 'Serious performance for demanding creative and professional workflows.',
    price: 'From $1,599 or $133.25/mo.',
    image: '/images/store/mac.png',
  },
  imac: {
    eyebrow: 'All in one',
    title: 'iMac',
    description: 'A vivid desktop experience with everything built beautifully together.',
    price: 'From $1,299 or $108.25/mo.',
    image: '/images/store/mac.png',
  },
  macMini: {
    eyebrow: 'Small footprint',
    title: 'Mac mini',
    description: 'A compact desktop with impressive performance and flexible connectivity.',
    price: 'From $599 or $49.92/mo.',
    image: '/images/store/mac.png',
  },
  ipadPro: {
    eyebrow: 'Remarkably capable',
    title: 'iPad Pro',
    description: 'A powerful, portable canvas for creativity, entertainment, and productivity.',
    price: 'From $999 or $83.25/mo.',
    image: '/images/store/ipad.png',
  },
  ipadAir: {
    eyebrow: 'Offer eligible',
    title: 'iPad Air',
    description: 'Versatile performance in a light design with room for every idea.',
    price: 'From $599 or $49.92/mo.',
    image: '/images/store/ipad.png',
  },
  ipadMini: {
    eyebrow: 'Made to travel',
    title: 'iPad mini',
    description: 'Full iPad capability in an ultraportable size that goes everywhere.',
    price: 'From $499 or $41.58/mo.',
    image: '/images/store/ipad.png',
  },
  iphonePro: {
    eyebrow: 'New',
    title: 'iPhone Pro',
    description: 'Advanced cameras, premium materials, and all-day performance.',
    price: 'From $999 or $41.62/mo.',
    image: '/images/store/iphone.png',
    dark: true,
  },
  iphone: {
    eyebrow: 'Everyday favorite',
    title: 'iPhone',
    description: 'A brilliant display, dependable battery life, and an effortless camera.',
    price: 'From $799 or $33.29/mo.',
    image: '/images/store/iphone.png',
  },
  iphoneValue: {
    eyebrow: 'Great value',
    title: 'iPhone Essential',
    description: 'The features you use most in a durable, colorful design.',
    price: 'From $599 or $24.95/mo.',
    image: '/images/store/iphone.png',
  },
  watch: {
    eyebrow: 'Fitness companion',
    title: 'Apple Watch',
    description: 'Stay active, connected, and informed right from your wrist.',
    price: 'From $399 or $33.25/mo.',
    image: '/images/store/apple-watch.png',
  },
  watchUltra: {
    eyebrow: 'Built for adventure',
    title: 'Apple Watch Ultra',
    description: 'A rugged watch for endurance, exploration, and everyday life.',
    price: 'From $799 or $66.58/mo.',
    image: '/images/store/apple-watch.png',
  },
  visionPro: {
    eyebrow: 'Spatial computing',
    title: 'Apple Vision Pro',
    description: 'Experience entertainment, work, and connection in an entirely new way.',
    price: 'From $3,499 or $291.58/mo.',
    image: '/images/store/apple-vision-pro.png',
    dark: true,
  },
  airpodsPro: {
    eyebrow: 'Free engraving',
    title: 'AirPods Pro',
    description: 'Immersive sound and intelligent noise control in a pocket-ready design.',
    price: '$249',
    image: '/images/store/airpods.png',
  },
  airpods: {
    eyebrow: 'Listen all day',
    title: 'AirPods',
    description: 'Comfortable wireless audio with effortless pairing across your devices.',
    price: 'From $129',
    image: '/images/store/airpods.png',
  },
  airtag: {
    eyebrow: 'Keep track',
    title: 'AirTag',
    description: 'A simple way to keep an eye on keys, bags, and everyday essentials.',
    price: 'From $29',
    image: '/images/store/airtag.png',
  },
  appleTV: {
    eyebrow: 'Big-screen entertainment',
    title: 'Apple TV 4K',
    description: 'Bring movies, shows, music, and games together in stunning quality.',
    price: 'From $129',
    image: '/images/store/apple-tv-4k.png',
  },
  homepod: {
    eyebrow: 'Room-filling sound',
    title: 'HomePod',
    description: 'Rich home audio with intelligent control in a compact design.',
    price: 'From $99',
    image: '/images/store/homepod.png',
  },
  accessories: {
    eyebrow: 'Complete your setup',
    title: 'Cases and bands',
    description: 'Protection, color, and everyday utility for the devices you love.',
    price: 'From $39',
    image: '/images/store/accessories.png',
  },
  giftCard: {
    eyebrow: 'Always the right fit',
    title: 'Gift Card',
    description: 'Let them choose the device, accessory, app, or experience they want.',
    price: 'Available from $25',
    image: '/images/store/apple-gift-card.png',
  },
} satisfies Record<string, ServiceCardData>;

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
}: {
  id: string;
  highlight: string;
  title: string;
  cards: ServiceCardData[];
}) {
  return (
    <section id={id} className="scroll-mt-28 py-7 md:py-10" aria-labelledby={`${id}-title`}>
      <h2
        id={`${id}-title`}
        className="px-5 text-2xl font-bold tracking-[-0.04em] text-store-ink md:px-8 md:text-[1.75rem]"
      >
        <span className="marker-highlight">{highlight}</span>{' '}
        <span className="text-black/55">{title}</span>
      </h2>
      <div
        className="card-scroll mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-5 md:px-8"
        role="list"
        aria-label={`${highlight} ${title}`}
      >
        {cards.map((card) => (
          <div key={card.title} role="listitem">
            <ServiceCard card={card} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main id="main-content">
      <section id="store" className="store-hero-copy overflow-hidden bg-black">
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
      </section>

      <div className="bg-store-canvas">
        <CategoryRail />
        <div className="mx-auto max-w-store">
          {storeCollections.map((collection) => (
            <CardCollection key={collection.id} {...collection} />
          ))}
        </div>
      </div>
    </main>
  );
}
