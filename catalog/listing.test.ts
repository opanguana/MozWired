import { mznPrice } from '@/types/money';
import { catalogListingItems } from '@/data/catalog-listing';

import {
  emptyCatalogFilters,
  filterCatalogItems,
  parseCatalogFilters,
  serializeCatalogFilters,
  sortCatalogItems,
  type CatalogListingItem,
} from './listing';

const items: CatalogListingItem[] = [
  {
    slug: 'alpha',
    href: '/products/alpha',
    brand: 'Lenovo',
    title: 'Alpha',
    category: 'computers',
    description: 'Alpha',
    price: mznPrice(200_000),
    availability: ['in_stock'],
    conditions: ['new'],
    processors: ['Core 5'],
    ram: ['8GB'],
    storage: ['256GB'],
    network: [],
    specification: 'Core 5 · 8GB',
    featuredRank: 1,
  },
  {
    slug: 'beta',
    href: '/products/beta',
    brand: 'ASUS',
    title: 'Beta',
    category: 'computers',
    description: 'Beta',
    price: mznPrice(100_000),
    availability: ['low_stock'],
    conditions: ['refurbished'],
    processors: ['Ryzen 5'],
    ram: ['16GB'],
    storage: ['512GB'],
    network: [],
    specification: 'Ryzen 5 · 16GB',
    featuredRank: 0,
  },
];

describe('catalogue listing filters', () => {
  it('combines category, brand, availability and specification filters', () => {
    expect(
      filterCatalogItems(items, {
        ...emptyCatalogFilters,
        category: 'computers',
        brands: ['ASUS'],
        availability: ['low_stock'],
        ram: ['16GB'],
      }).map(({ slug }) => slug)
    ).toEqual(['beta']);
  });

  it('round-trips shareable URL parameters', () => {
    const filters = parseCatalogFilters(
      new URLSearchParams(
        'category=computers&brand=Lenovo&brand=ASUS&minPrice=1000&sort=price-desc'
      )
    );
    expect(filters).toMatchObject({
      category: 'computers',
      brands: ['Lenovo', 'ASUS'],
      minPriceMinor: 100_000,
      sort: 'price-desc',
    });
    expect(serializeCatalogFilters(filters).toString()).toContain('brand=Lenovo&brand=ASUS');
  });

  it('sorts copies without mutating catalogue order', () => {
    expect(sortCatalogItems(items, 'price-asc').map(({ slug }) => slug)).toEqual(['beta', 'alpha']);
    expect(items.map(({ slug }) => slug)).toEqual(['alpha', 'beta']);
  });

  it('lists a grouped model once and keeps its shared detail route', () => {
    const grouped = catalogListingItems.filter(({ slug }) => slug === 'ideapad-1-15iau7');

    expect(grouped).toHaveLength(1);
    expect(grouped[0]).toMatchObject({ href: '/products/ideapad-1-15iau7' });
  });
});
