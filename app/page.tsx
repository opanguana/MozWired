import { ArrowRight, Asterisk, Hand, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { CategoryRail } from '@/components/store/CategoryRail';
import { ServiceCard, type ServiceCardData } from '@/components/store/ServiceCard';
import { StoreActions } from '@/components/store/StoreActions';

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
      <div className="card-scroll mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-5 md:px-8">
        {cards.map((card) => (
          <ServiceCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main id="main-content">
      <section id="store" className="campaign-hero overflow-hidden bg-black text-white">
        <div className="relative mx-auto grid min-h-[19rem] max-w-store items-center gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:px-8 md:py-14">
          <Sparkles
            aria-hidden="true"
            className="absolute right-[46%] top-6 hidden size-12 rotate-12 text-fuchsia-500 lg:block"
            strokeWidth={2.4}
          />
          <Hand
            aria-hidden="true"
            className="absolute left-7 top-7 hidden size-12 -rotate-12 text-emerald-400 md:block"
            strokeWidth={2.5}
          />
          <Asterisk
            aria-hidden="true"
            className="absolute bottom-5 left-[44%] hidden size-11 rotate-12 text-yellow-300 md:block"
            strokeWidth={3}
          />

          <div className="relative z-10 max-w-3xl pt-4 md:pt-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-store-cyan">
              Technology, sorted.
            </p>
            <h1 className="text-[clamp(3rem,7vw,5.75rem)] font-bold leading-[0.9] tracking-[-0.065em]">
              The work store.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              Networks, cloud, security, and digital products—selected and delivered for the way
              your team works.
            </p>
          </div>

          <div className="relative z-10 max-w-sm pb-5 md:pt-12">
            <p className="text-xl font-bold tracking-tight">
              Your stack, <span className="marker-highlight text-black">sorted.</span>
            </p>
            <p className="mb-5 mt-2 text-sm leading-relaxed text-white/60">
              Start with a specialist or browse the services teams ask for most.
            </p>
            <StoreActions />
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
