import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { CategoryRail } from '@/components/store/CategoryRail';
import { ServiceCard, type ServiceCardData } from '@/components/store/ServiceCard';

const essentials: ServiceCardData[] = [
  {
    eyebrow: 'Limited time',
    title: 'Move your workplace without moving the goalposts.',
    description:
      'A guided migration plan for mail, files, identities, and the people who use them.',
    price: 'From discovery to go-live, with one accountable team.',
    kind: 'migration',
    dark: true,
  },
  {
    eyebrow: 'Team ready',
    title: 'Managed devices',
    description: 'Enroll, configure, and protect every work device without slowing anyone down.',
    price: 'Flexible coverage for growing teams.',
    kind: 'devices',
  },
  {
    eyebrow: 'Built secure',
    title: 'Identity protection',
    description: 'Keep access simple for your team and difficult for everyone else.',
    price: 'Modern authentication and unified policies.',
    kind: 'security',
  },
  {
    eyebrow: 'Always connected',
    title: 'Structured networks',
    description: 'Reliable cabling and switching designed around how your spaces actually work.',
    price: 'Survey, design, installation, and support.',
    kind: 'networks',
  },
];

const specialistServices: ServiceCardData[] = [
  {
    eyebrow: 'New',
    title: 'Cloud foundations',
    description: 'A clear, scalable Microsoft cloud setup without the sprawling complexity.',
    price: 'Designed for performance and predictable growth.',
    kind: 'cloud',
    accent: true,
  },
  {
    eyebrow: 'Made to fit',
    title: 'Web platforms',
    description: 'Fast, accessible digital products with an architecture your team can maintain.',
    price: 'Strategy, interface design, and engineering.',
    kind: 'web',
    accent: true,
  },
  {
    eyebrow: 'Responsive',
    title: 'Managed support',
    description: 'Practical help from engineers who understand your systems and your priorities.',
    price: 'Remote and on-site options available.',
    kind: 'support',
    accent: true,
  },
  {
    eyebrow: 'Controlled',
    title: 'Endpoint operations',
    description: 'Provision, update, and retire devices with consistent controls at every stage.',
    price: 'Clear inventory and fewer manual tasks.',
    kind: 'endpoint',
    accent: true,
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
            <h1 className="text-[clamp(3rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
              Your Trusted Store
            </h1>
          </div>

          <div className="md:min-w-60 md:text-right">
            <p className="text-[1.75rem] font-semibold leading-none tracking-[-0.035em]">
              Life, <span className="marker-highlight text-black">sorted.</span>
            </p>
            <div className="mt-4 grid justify-items-start gap-2 text-[13px] md:justify-items-end">
              <Link
                href="#support"
                className="rounded-sm text-[#2997ff] hover:underline focus-ring"
              >
                Connect with a Specialist ↗
              </Link>
              <Link
                href="#services"
                className="rounded-sm text-[#2997ff] hover:underline focus-ring"
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
          <CardCollection
            id="services"
            highlight="Popular right now."
            title="Workplace essentials."
            cards={essentials}
          />
          <CardCollection
            id="cloud"
            highlight="Built around you."
            title="Specialist services."
            cards={specialistServices}
          />

          <section
            id="support"
            className="mx-5 my-10 flex flex-col justify-between gap-6 rounded-[2rem] bg-black px-6 py-8 text-white md:mx-8 md:flex-row md:items-center md:px-10 md:py-10"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-store-cyan">
                Need a clearer next step?
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em]">
                Bring us the complicated part.
              </h2>
            </div>
            <Link
              href="mailto:hello@mozwired.example"
              className="focus-ring inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black transition hover:bg-store-cyan"
            >
              Contact support <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
