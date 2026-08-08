import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { getCatalog } from '@/catalog/load';
import brandLogoManifest from '@/data/brand-logo-manifest.json';

import { getBrandAsset } from './brand-assets';

describe('brand assets', () => {
  it('documents every brand in the published catalogue', () => {
    const documentedBrands = new Set(brandLogoManifest.map(({ brand }) => brand));
    const publishedBrands = new Set(getCatalog().map(({ brand }) => brand));

    expect([...publishedBrands].filter((brand) => !documentedBrands.has(brand))).toEqual([]);
  });

  it('resolves every installed manifest entry to an existing local asset', () => {
    const installed = brandLogoManifest.filter(({ status }) => status === 'installed');

    installed.forEach(({ brand, localPath }) => {
      expect(localPath).not.toBeNull();
      expect(getBrandAsset(brand)?.src).toBe(localPath);
      expect(existsSync(join(process.cwd(), 'public', localPath as string))).toBe(true);
    });
  });

  it('uses an explicit fallback for brands awaiting an approved asset', () => {
    expect(getBrandAsset('HP')).toBeNull();
    expect(getBrandAsset('Redmi')).toBeNull();
  });
});
