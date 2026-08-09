import type { CatalogAvailability, CatalogCategory } from './schema';
import type { ProductPrice } from '@/types/money';

export type CatalogListingItem = {
  slug: string;
  href: string;
  brand: string;
  title: string;
  category: CatalogCategory;
  description: string;
  image?: string;
  price: ProductPrice | null;
  availability: CatalogAvailability[];
  conditions: string[];
  processors: string[];
  ram: string[];
  storage: string[];
  network: string[];
  specification: string;
  featuredRank: number;
};

export type CatalogFilters = {
  category?: CatalogCategory;
  brands: string[];
  availability: CatalogAvailability[];
  conditions: string[];
  processors: string[];
  ram: string[];
  storage: string[];
  network: string[];
  minPriceMinor?: number;
  maxPriceMinor?: number;
  sort: CatalogSort;
};

export type CatalogSort = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export const catalogSorts: CatalogSort[] = ['featured', 'price-asc', 'price-desc', 'name-asc'];

export const emptyCatalogFilters: CatalogFilters = {
  brands: [],
  availability: [],
  conditions: [],
  processors: [],
  ram: [],
  storage: [],
  network: [],
  sort: 'featured',
};

function intersects(left: string[], right: string[]) {
  return !right.length || right.some((value) => left.includes(value));
}

export function filterCatalogItems(items: CatalogListingItem[], filters: CatalogFilters) {
  return items.filter((item) => {
    const amount = item.price?.amount.amountMinor;
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.brands.length || filters.brands.includes(item.brand)) &&
      intersects(
        item.availability.filter(Boolean) as string[],
        filters.availability.filter(Boolean) as string[]
      ) &&
      intersects(item.conditions, filters.conditions) &&
      intersects(item.processors, filters.processors) &&
      intersects(item.ram, filters.ram) &&
      intersects(item.storage, filters.storage) &&
      intersects(item.network, filters.network) &&
      (filters.minPriceMinor === undefined ||
        (amount !== undefined && amount >= filters.minPriceMinor)) &&
      (filters.maxPriceMinor === undefined ||
        (amount !== undefined && amount <= filters.maxPriceMinor))
    );
  });
}

export function sortCatalogItems(items: CatalogListingItem[], sort: CatalogSort) {
  return [...items].sort((left, right) => {
    if (sort === 'name-asc') return left.title.localeCompare(right.title);

    if (sort === 'price-asc' || sort === 'price-desc') {
      const fallback = sort === 'price-asc' ? Number.MAX_SAFE_INTEGER : -1;
      const difference =
        (left.price?.amount.amountMinor ?? fallback) -
        (right.price?.amount.amountMinor ?? fallback);
      return sort === 'price-asc' ? difference : -difference;
    }

    return left.featuredRank - right.featuredRank;
  });
}

function repeated(params: URLSearchParams, key: string) {
  return params
    .getAll(key)
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseMzn(value: string | null) {
  if (!value) return undefined;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) : undefined;
}

export function parseCatalogFilters(params: URLSearchParams): CatalogFilters {
  const category = params.get('category');
  const sort = params.get('sort');

  return {
    category: ['computers', 'phones', 'mobile', 'audio', 'accessories'].includes(category ?? '')
      ? (category as CatalogCategory)
      : undefined,
    brands: repeated(params, 'brand'),
    availability: repeated(params, 'availability') as CatalogAvailability[],
    conditions: repeated(params, 'condition'),
    processors: repeated(params, 'processor'),
    ram: repeated(params, 'ram'),
    storage: repeated(params, 'storage'),
    network: repeated(params, 'network'),
    minPriceMinor: parseMzn(params.get('minPrice')),
    maxPriceMinor: parseMzn(params.get('maxPrice')),
    sort: catalogSorts.includes(sort as CatalogSort) ? (sort as CatalogSort) : 'featured',
  };
}

export function serializeCatalogFilters(filters: CatalogFilters) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  (
    [
      ['brand', filters.brands],
      ['availability', filters.availability.filter(Boolean) as string[]],
      ['condition', filters.conditions],
      ['processor', filters.processors],
      ['ram', filters.ram],
      ['storage', filters.storage],
      ['network', filters.network],
    ] as const
  ).forEach(([key, values]) => values.forEach((value) => params.append(key, value)));
  if (filters.minPriceMinor !== undefined)
    params.set('minPrice', String(filters.minPriceMinor / 100));
  if (filters.maxPriceMinor !== undefined)
    params.set('maxPrice', String(filters.maxPriceMinor / 100));
  if (filters.sort !== 'featured') params.set('sort', filters.sort);
  return params;
}

export function optionCounts(
  items: CatalogListingItem[],
  values: (item: CatalogListingItem) => string[]
) {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    new Set(values(item)).forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  });
  return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right));
}
