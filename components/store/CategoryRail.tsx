import {
  Cable,
  CloudCog,
  Code2,
  Database,
  Headphones,
  KeyRound,
  Laptop,
  Network,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

const categories: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'Networks', href: '#networks', Icon: Network },
  { label: 'Cloud', href: '#cloud', Icon: CloudCog },
  { label: 'Devices', href: '#devices', Icon: Smartphone },
  { label: 'Security', href: '#security', Icon: ShieldCheck },
  { label: 'Laptops', href: '#devices', Icon: Laptop },
  { label: 'Data', href: '#cloud', Icon: Database },
  { label: 'Identity', href: '#security', Icon: KeyRound },
  { label: 'Cabling', href: '#networks', Icon: Cable },
  { label: 'Web', href: '#web', Icon: Code2 },
  { label: 'Support', href: '#support', Icon: Headphones },
];

export function CategoryRail() {
  return (
    <nav aria-label="Service categories" className="category-scroll">
      <ul className="mx-auto flex w-max min-w-full max-w-store items-start justify-start gap-7 px-5 py-9 md:justify-between lg:px-8">
        {categories.map(({ label, href, Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="group flex w-16 flex-col items-center gap-2 rounded-lg text-center focus-ring"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-md">
                <Icon aria-hidden="true" className="size-8 text-store-ink" strokeWidth={1.45} />
              </span>
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
