export type BrandAsset = {
  src: string;
  width: number;
  height: number;
};

export const brandAssets: Readonly<Record<string, BrandAsset>> = {
  ASUS: {
    src: '/images/brands/asus.svg',
    width: 400,
    height: 84,
  },
  Connex: {
    src: '/images/brands/connex.png',
    width: 200,
    height: 49,
  },
  Dell: {
    src: '/images/brands/dell.png',
    width: 1223,
    height: 701,
  },
  Lenovo: {
    src: '/images/brands/lenovo.svg',
    width: 124,
    height: 40,
  },
  MSI: {
    src: '/images/brands/msi.png',
    width: 681,
    height: 171,
  },
  Samsung: {
    src: '/images/brands/samsung.png',
    width: 154,
    height: 25,
  },
  Targus: {
    src: '/images/brands/targus.png',
    width: 137,
    height: 26,
  },
};

export function getBrandAsset(brand: string) {
  return brandAssets[brand] ?? null;
}
