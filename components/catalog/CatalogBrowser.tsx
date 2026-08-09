'use client';

import { Filter, Headphones, Laptop, Package, RotateCcw, Smartphone, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import {
  emptyCatalogFilters,
  filterCatalogItems,
  optionCounts,
  parseCatalogFilters,
  serializeCatalogFilters,
  sortCatalogItems,
  type CatalogFilters,
  type CatalogListingItem,
  type CatalogSort,
} from '@/catalog/listing';
import type { CatalogCategory } from '@/catalog/schema';
import { cn } from '@/lib/utils';

import { CatalogCard } from './CatalogCard';

const categoryDetails: Record<CatalogCategory, { label: string; icon: typeof Package }> = {
  computers: { label: 'Computers', icon: Laptop },
  phones: { label: 'Phones', icon: Smartphone },
  mobile: { label: 'Mobile', icon: Smartphone },
  audio: { label: 'Audio', icon: Headphones },
  accessories: { label: 'Accessories', icon: Package },
};

const sortLabels: Record<CatalogSort, string> = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  'name-asc': 'Name: A–Z',
};

type ArrayFilterKey =
  'brands' | 'availability' | 'conditions' | 'processors' | 'ram' | 'storage' | 'network';

function FilterGroup({
  title,
  name,
  options,
  selected,
  onToggle,
}: {
  title: string;
  name: string;
  options: Array<[string, number]>;
  selected: string[];
  onToggle: (value: string) => void;
}) {
  if (!options.length) return null;
  return (
    <fieldset className="border-t border-white/10 py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-white/80">
        {title}
      </legend>
      <div className="space-y-2.5">
        {options.map(([value, count]) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 text-xs text-white/65"
          >
            <input
              type="checkbox"
              name={name}
              value={value}
              checked={selected.includes(value)}
              onChange={() => onToggle(value)}
              className="size-4 accent-cyan-400"
            />
            <span className="min-w-0 flex-1 truncate">{value.replaceAll('_', ' ')}</span>
            <span className="text-white/35">{count}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FilterPanel({
  items,
  filters,
  onChange,
  onClear,
}: {
  items: CatalogListingItem[];
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  onClear: () => void;
}) {
  const toggle = (key: ArrayFilterKey, value: string) => {
    const current = filters[key] as string[];
    onChange({
      ...filters,
      [key]: current.includes(value)
        ? current.filter((candidate) => candidate !== value)
        : [...current, value],
    });
  };

  return (
    <div className="bg-[#121214] p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold">
          <Filter aria-hidden="true" size={16} /> Filter
        </span>
        <button type="button" onClick={onClear} className="focus-ring text-xs text-store-cyan">
          Clear all
        </button>
      </div>
      <FilterGroup
        title="Brand"
        name="brand"
        options={optionCounts(items, (item) => [item.brand])}
        selected={filters.brands}
        onToggle={(value) => toggle('brands', value)}
      />
      <div className="border-t border-white/10 py-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-white/80">
          Price (MZN)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-[10px] text-white/45">
            Minimum
            <input
              aria-label="Minimum price"
              type="number"
              min="0"
              value={filters.minPriceMinor === undefined ? '' : filters.minPriceMinor / 100}
              onChange={(event) =>
                onChange({
                  ...filters,
                  minPriceMinor: event.target.value ? Number(event.target.value) * 100 : undefined,
                })
              }
              className="focus-ring mt-1 h-10 w-full border border-white/15 bg-black px-2 text-xs text-white"
            />
          </label>
          <label className="text-[10px] text-white/45">
            Maximum
            <input
              aria-label="Maximum price"
              type="number"
              min="0"
              value={filters.maxPriceMinor === undefined ? '' : filters.maxPriceMinor / 100}
              onChange={(event) =>
                onChange({
                  ...filters,
                  maxPriceMinor: event.target.value ? Number(event.target.value) * 100 : undefined,
                })
              }
              className="focus-ring mt-1 h-10 w-full border border-white/15 bg-black px-2 text-xs text-white"
            />
          </label>
        </div>
      </div>
      <FilterGroup
        title="Availability"
        name="availability"
        options={optionCounts(items, (item) => item.availability.filter(Boolean) as string[])}
        selected={filters.availability.filter(Boolean) as string[]}
        onToggle={(value) => toggle('availability', value)}
      />
      <FilterGroup
        title="Condition"
        name="condition"
        options={optionCounts(items, (item) => item.conditions)}
        selected={filters.conditions}
        onToggle={(value) => toggle('conditions', value)}
      />
      <FilterGroup
        title="Processor"
        name="processor"
        options={optionCounts(items, (item) => item.processors)}
        selected={filters.processors}
        onToggle={(value) => toggle('processors', value)}
      />
      <FilterGroup
        title="RAM"
        name="ram"
        options={optionCounts(items, (item) => item.ram)}
        selected={filters.ram}
        onToggle={(value) => toggle('ram', value)}
      />
      <FilterGroup
        title="Storage"
        name="storage"
        options={optionCounts(items, (item) => item.storage)}
        selected={filters.storage}
        onToggle={(value) => toggle('storage', value)}
      />
      <FilterGroup
        title="Network"
        name="network"
        options={optionCounts(items, (item) => item.network)}
        selected={filters.network}
        onToggle={(value) => toggle('network', value)}
      />
    </div>
  );
}

export function CatalogBrowser({ items }: { items: CatalogListingItem[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const query = searchParams.toString();
  const [filters, setFilters] = useState(() => parseCatalogFilters(new URLSearchParams(query)));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => setFilters(parseCatalogFilters(new URLSearchParams(query))), [query]);

  const updateFilters = (next: CatalogFilters) => {
    setFilters(next);
    setVisibleCount(24);
    const params = serializeCatalogFilters(next).toString();
    router.replace(params ? `${pathname}?${params}` : pathname, { scroll: false });
  };

  const categoryCounts = useMemo(() => optionCounts(items, (item) => [item.category]), [items]);
  const results = useMemo(
    () => sortCatalogItems(filterCatalogItems(items, filters), filters.sort),
    [filters, items]
  );
  const clearFilters = () => updateFilters({ ...emptyCatalogFilters });

  return (
    <>
      <nav
        aria-label="Product categories"
        className="card-scroll -mx-safe overflow-x-auto px-safe pb-1"
      >
        <div className="flex min-w-max gap-2">
          <button
            type="button"
            onClick={() => updateFilters({ ...filters, category: undefined })}
            className={cn(
              'focus-ring flex h-24 w-32 flex-col items-center justify-center gap-2 border px-3 text-xs font-semibold',
              !filters.category
                ? 'border-store-cyan bg-white text-black'
                : 'border-white/10 bg-[#151517] text-white/70'
            )}
          >
            <Package aria-hidden="true" size={22} /> All products{' '}
            <span className="text-[10px] opacity-50">{items.length}</span>
          </button>
          {categoryCounts.map(([category, count]) => {
            const detail = categoryDetails[category as CatalogCategory];
            const Icon = detail.icon;
            return (
              <button
                key={category}
                type="button"
                onClick={() => updateFilters({ ...filters, category: category as CatalogCategory })}
                className={cn(
                  'focus-ring flex h-24 w-32 flex-col items-center justify-center gap-2 border px-3 text-xs font-semibold',
                  filters.category === category
                    ? 'border-store-cyan bg-white text-black'
                    : 'border-white/10 bg-[#151517] text-white/70'
                )}
              >
                <Icon aria-hidden="true" size={22} /> {detail.label}
                <span className="text-[10px] opacity-50">{count}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.04em]">
            {filters.category ? categoryDetails[filters.category].label : 'All products'}
          </h1>
          <p aria-live="polite" className="mt-1 text-sm text-white/45">
            {results.length} {results.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="focus-ring flex h-11 items-center gap-2 border border-white/15 px-3 text-sm lg:hidden"
          >
            <Filter aria-hidden="true" size={16} /> Filters
          </button>
          <label className="flex items-center gap-2 text-xs text-white/55">
            Sort by
            <select
              aria-label="Sort products"
              value={filters.sort}
              onChange={(event) =>
                updateFilters({ ...filters, sort: event.target.value as CatalogSort })
              }
              className="focus-ring h-11 border border-white/15 bg-[#121214] px-3 text-sm text-white"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside aria-label="Product filters" className="hidden lg:block">
          <FilterPanel
            items={items}
            filters={filters}
            onChange={updateFilters}
            onClear={clearFilters}
          />
        </aside>
        <div>
          {results.length ? (
            <div className="grid grid-cols-1 gap-3 min-[28rem]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {results.slice(0, visibleCount).map((item) => (
                <CatalogCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center border border-white/10 bg-[#121214] px-6 text-center">
              <Package aria-hidden="true" className="mb-4 size-12 text-white/25" />
              <h2 className="text-xl font-bold">No products match these filters</h2>
              <p className="mt-2 max-w-md text-sm text-white/50">
                Clear or adjust the filters to see more of the catalogue.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="focus-ring mt-5 flex h-11 items-center gap-2 border border-white/20 px-4 text-sm"
              >
                <RotateCcw aria-hidden="true" size={15} /> Clear filters
              </button>
            </div>
          )}
          {visibleCount < results.length && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 24)}
                className="focus-ring h-11 border border-white/20 px-6 text-sm font-semibold hover:bg-white hover:text-black"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
        >
          <button
            type="button"
            aria-label="Close product filters"
            onClick={() => setFiltersOpen(false)}
            className="absolute inset-0 bg-black/75"
          />
          <div className="absolute inset-y-0 right-0 w-[min(90vw,22rem)] overflow-y-auto bg-[#0b0b0c] p-4 shadow-2xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="focus-ring flex size-11 items-center justify-center"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <FilterPanel
              items={items}
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
            />
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="focus-ring mt-4 h-12 w-full bg-white text-sm font-bold text-black"
            >
              Show {results.length} products
            </button>
          </div>
        </div>
      )}
    </>
  );
}
