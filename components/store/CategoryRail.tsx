import { Laptop, Package, Smartphone } from 'lucide-react';
import Link from 'next/link';

import { catalogProducts } from '@/data/catalog';

const categories = [
  {
    category: 'computers',
    label: 'Computers',
    href: '#services',
    icon: Laptop,
  },
  {
    category: 'phones',
    label: 'Smartphones',
    href: '#favorites',
    icon: Smartphone,
  },
  {
    category: 'accessories',
    label: 'Accessories',
    href: '#accessories',
    icon: Package,
  },
] as const;

export function CategoryRail() {
  const activeCategories = categories.filter(({ category }) =>
    catalogProducts.some((product) => product.category === category)
  );

  return (
    <nav aria-label="Product categories" className="category-scroll overflow-x-auto">
      <ul className="mx-auto flex w-max min-w-full max-w-store items-start justify-center gap-3 px-5 py-8 lg:px-8">
        {activeCategories.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="group flex w-[6.5rem] flex-col items-center gap-2 rounded-lg text-center focus-ring"
            >
              <span className="flex h-[4.5rem] w-[6.75rem] items-center justify-center transition-transform duration-200 group-hover:-translate-y-1">
                <Icon aria-hidden="true" className="size-10" strokeWidth={1.4} />
              </span>
              <span className="text-[10px] font-semibold leading-tight">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
