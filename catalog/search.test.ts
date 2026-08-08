import { getCatalog } from '@/catalog/load';

import { buildProductSearchIndex, filterProductSearchIndex } from './search';

describe('product search index', () => {
  it('contains published products and excludes archived products and internal SKUs', () => {
    const index = buildProductSearchIndex(getCatalog({ includeArchived: true }));

    expect(index.some(({ slug }) => slug === 'galaxy-a06')).toBe(true);
    expect(index.some(({ slug }) => slug === 'macbook-air')).toBe(false);
    expect(JSON.stringify(index)).not.toMatch(/TMP-|sku/i);
  });

  it('normalizes whitespace and matches title, brand, category, description and specifications', () => {
    const index = buildProductSearchIndex(getCatalog());

    expect(filterProductSearchIndex(index, '  samsung   128GB ')).not.toHaveLength(0);
    expect(filterProductSearchIndex(index, 'phones')).not.toHaveLength(0);
    expect(filterProductSearchIndex(index, 'everyday use')).not.toHaveLength(0);
  });
});
