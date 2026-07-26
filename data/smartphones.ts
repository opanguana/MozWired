import type { ServiceCardData } from '@/components/store/ServiceCard';

export type SmartphoneSku = {
  brand: 'Samsung' | 'Apple';
  model: string;
  network?: '4G' | '5G';
  storage: string;
  ram?: string;
  priceMzn: number;
};

export const smartphoneInventory: SmartphoneSku[] = [
  {
    brand: 'Samsung',
    model: 'Galaxy A04e',
    network: '4G',
    storage: '32GB',
    ram: '3GB',
    priceMzn: 5950,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A05s',
    network: '4G',
    storage: '128GB',
    ram: '4GB',
    priceMzn: 10550,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A06',
    network: '4G',
    storage: '64GB',
    ram: '4GB',
    priceMzn: 7000,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A06',
    network: '4G',
    storage: '128GB',
    ram: '4GB',
    priceMzn: 8850,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A07',
    network: '4G',
    storage: '64GB',
    ram: '4GB',
    priceMzn: 7600,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A07',
    network: '4G',
    storage: '128GB',
    ram: '4GB',
    priceMzn: 8600,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A16',
    network: '4G',
    storage: '128GB',
    ram: '4GB',
    priceMzn: 10000,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A17',
    network: '4G',
    storage: '128GB',
    ram: '4GB',
    priceMzn: 12000,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A17',
    network: '4G',
    storage: '128GB',
    ram: '6GB',
    priceMzn: 13700,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A17',
    network: '4G',
    storage: '256GB',
    ram: '8GB',
    priceMzn: 14950,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A25',
    network: '5G',
    storage: '128GB',
    ram: '6GB',
    priceMzn: 14500,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A26',
    network: '5G',
    storage: '128GB',
    ram: '6GB',
    priceMzn: 16400,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A26',
    network: '5G',
    storage: '256GB',
    ram: '8GB',
    priceMzn: 18800,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A36',
    network: '5G',
    storage: '128GB',
    ram: '6GB',
    priceMzn: 20500,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A36',
    network: '5G',
    storage: '128GB',
    ram: '8GB',
    priceMzn: 20300,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A36',
    network: '5G',
    storage: '256GB',
    ram: '8GB',
    priceMzn: 22800,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A37',
    network: '5G',
    storage: '128GB',
    ram: '8GB',
    priceMzn: 24800,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A37',
    network: '5G',
    storage: '256GB',
    ram: '8GB',
    priceMzn: 26300,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A56',
    network: '5G',
    storage: '128GB',
    ram: '8GB',
    priceMzn: 25300,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A56',
    network: '5G',
    storage: '256GB',
    ram: '8GB',
    priceMzn: 27300,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A57',
    network: '5G',
    storage: '128GB',
    ram: '6GB',
    priceMzn: 28300,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A57',
    network: '5G',
    storage: '128GB',
    ram: '8GB',
    priceMzn: 31000,
  },
  {
    brand: 'Samsung',
    model: 'Galaxy A57',
    network: '5G',
    storage: '256GB',
    ram: '8GB',
    priceMzn: 30300,
  },
  { brand: 'Apple', model: 'iPhone XR', storage: '64GB', priceMzn: 12800 },
  { brand: 'Apple', model: 'iPhone XR', storage: '128GB', priceMzn: 14000 },
  { brand: 'Apple', model: 'iPhone 11', storage: '64GB', priceMzn: 16000 },
  { brand: 'Apple', model: 'iPhone 11', storage: '128GB', priceMzn: 17400 },
  { brand: 'Apple', model: 'iPhone 12', storage: '128GB', priceMzn: 19800 },
  { brand: 'Apple', model: 'iPhone 12 Pro', storage: '128GB', priceMzn: 25500 },
  { brand: 'Apple', model: 'iPhone 12 Pro Max', storage: '256GB', priceMzn: 32000 },
  { brand: 'Apple', model: 'iPhone 13', storage: '128GB', priceMzn: 25800 },
  { brand: 'Apple', model: 'iPhone 13 Pro', storage: '256GB', priceMzn: 36000 },
  { brand: 'Apple', model: 'iPhone 13 Pro Max', storage: '256GB', priceMzn: 41000 },
  { brand: 'Apple', model: 'iPhone 14 Pro', storage: '256GB', priceMzn: 42000 },
  { brand: 'Apple', model: 'iPhone 14 Pro Max', storage: '256GB', priceMzn: 46000 },
  { brand: 'Apple', model: 'iPhone 15 Pro Max', storage: '256GB', priceMzn: 59500 },
];

/**
 * Map a model to a public image path after downloading its product photo.
 * A missing entry intentionally renders the catalog's "Image coming soon" placeholder.
 */
export const smartphoneImages: Partial<Record<string, string>> = {
  'iPhone XR': '/images/store/iphone.png',
  'iPhone 11': '/images/store/iphone.png',
  'iPhone 12': '/images/store/iphone.png',
  'iPhone 12 Pro': '/images/store/iphone.png',
  'iPhone 12 Pro Max': '/images/store/iphone.png',
  'iPhone 13': '/images/store/iphone.png',
  'iPhone 13 Pro': '/images/store/iphone.png',
  'iPhone 13 Pro Max': '/images/store/iphone.png',
  'iPhone 14 Pro': '/images/store/iphone.png',
  'iPhone 14 Pro Max': '/images/store/iphone.png',
  'iPhone 15 Pro Max': '/images/store/iphone.png',
};

const formatMzn = (value: number) => `${new Intl.NumberFormat('en-US').format(value)} MZN`;

export function buildSmartphoneCards(brand: SmartphoneSku['brand']): ServiceCardData[] {
  const groupedModels = new Map<string, SmartphoneSku[]>();

  smartphoneInventory
    .filter((sku) => sku.brand === brand)
    .forEach((sku) => {
      groupedModels.set(sku.model, [...(groupedModels.get(sku.model) ?? []), sku]);
    });

  return [...groupedModels.entries()].map(([model, variants]) => {
    const prices = variants.map(({ priceMzn }) => priceMzn);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const networks = [...new Set(variants.flatMap(({ network }) => (network ? [network] : [])))];
    const variantSummary = variants
      .map(({ storage, ram }) => (ram ? `${storage}/${ram} RAM` : storage))
      .join(' • ');

    return {
      eyebrow: networks.length ? networks.join(' / ') : brand,
      title: model,
      description: variantSummary,
      price:
        lowestPrice === highestPrice
          ? formatMzn(lowestPrice)
          : `${formatMzn(lowestPrice)} – ${formatMzn(highestPrice)}`,
      image: smartphoneImages[model],
      accent: true,
    };
  });
}
