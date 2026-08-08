import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const [catalogPath, computerInventoryPath, outputPath] = process.argv.slice(2);
if (!catalogPath || !computerInventoryPath || !outputPath) {
  throw new Error('Usage: node build-july-candidate.mjs <catalog> <computer-inventory> <output>');
}

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const computerSource = await readFile(computerInventoryPath, 'utf8');
const updatedAt = '2026-07-30T00:00:00+02:00';

const smartphoneRows = [
  ['Samsung', 'Galaxy A06', '64GB', '4GB', '4G', 8550, '1 ano', ''],
  ['Samsung', 'Galaxy A06', '128GB', '4GB', '4G', 9300, '1 ano', ''],
  ['Samsung', 'Galaxy A07', '64GB', '4GB', '4G', 8550, '1 ano', ''],
  ['Samsung', 'Galaxy A07', '128GB', '4GB', '4G', 9600, '1 ano', ''],
  ['Samsung', 'Galaxy A16', '128GB', '4GB', '4G', 10800, '1 ano', ''],
  ['Samsung', 'Galaxy A17', '128GB', '4GB', '4G', 12400, '1 ano', 'Promoção'],
  ['Samsung', 'Galaxy A17', '128GB', '6GB', '4G', 13700, '1 ano', ''],
  ['Samsung', 'Galaxy A17', '256GB', '8GB', '4G', 15100, '1 ano', ''],
  ['Samsung', 'Galaxy A26', '128GB', '6GB', '5G', 16400, '1 ano', ''],
  ['Samsung', 'Galaxy A26', '256GB', '8GB', '5G', 18800, '1 ano', ''],
  ['Samsung', 'Galaxy A36', '128GB', '8GB', '5G', 20300, '1 ano', ''],
  ['Samsung', 'Galaxy A36', '256GB', '8GB', '5G', 22800, '1 ano', ''],
  ['Samsung', 'Galaxy A37', '128GB', '8GB', '5G', 24800, '1 ano', 'Novo'],
  ['Samsung', 'Galaxy A37', '256GB', '8GB', '5G', 26300, '1 ano', 'Novo Promoção'],
  ['Samsung', 'Galaxy A56', '128GB', '8GB', '5G', 25300, '1 ano', ''],
  ['Samsung', 'Galaxy A56', '256GB', '8GB', '5G', 27300, '1 ano', ''],
  ['Samsung', 'Galaxy A57', '128GB', '6GB', '5G', 28300, '1 ano', 'Novo'],
  ['Samsung', 'Galaxy A57', '256GB', '8GB', '5G', 30300, '1 ano', 'Novo'],
  ['Redmi', 'Redmi A5', '64GB', '4GB', null, 7300, '1 ano', ''],
  ['Redmi', 'Redmi A5', '128GB', '4GB', null, 7850, '1 ano', ''],
  ['Redmi', 'Redmi A7', '64GB', '3GB', null, 7700, '1 ano', ''],
  ['Redmi', 'Redmi A7 Pro', '64GB', '4GB', null, 8000, '1 ano', ''],
  ['Redmi', 'Redmi 9T', '128GB', '4GB', null, 7100, '3 meses', ''],
  ['Redmi', 'Redmi 15C', '128GB', '4GB', null, 9400, '1 ano', ''],
  ['Redmi', 'Redmi 15C', '256GB', '8GB', null, 10700, '1 ano', ''],
  ['Redmi', 'Redmi 15', '128GB', '6GB', '4G', 10900, '1 ano', ''],
  ['Redmi', 'Redmi 15', '256GB', '8GB', null, 12200, '1 ano', ''],
  ['Redmi', 'Redmi Note 7 Pro', '128GB', '6GB', null, 6200, '14 dias', 'Reforb'],
  ['Redmi', 'Redmi Note 10 5G', '256GB', '8GB', '5G', 8200, '3 meses', ''],
  ['Redmi', 'Redmi Note 11E', '128GB', '6GB', null, 7800, '3 meses', ''],
  ['Redmi', 'Redmi Note 12 Pro 5G', '128GB', '6GB', '5G', 13600, '3 meses', ''],
  ['Redmi', 'Redmi Note 13 Pro', '256GB', '12GB', null, 16800, '3 meses', ''],
  ['Redmi', 'Redmi Note 14', '128GB', '6GB', null, 12300, '1 ano', ''],
  ['Redmi', 'Redmi Note 14', '256GB', '8GB', null, 14100, '1 ano', ''],
  ['Redmi', 'Redmi Note 14S', '128GB', '8GB', null, 14400, '1 ano', ''],
  ['Redmi', 'Redmi Note 14S', '256GB', '8GB', null, 15500, '1 ano', ''],
  ['Redmi', 'Redmi Note 14 Pro', '256GB', '8GB', null, 17800, '1 ano', ''],
];

function slug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function price(amountMzn) {
  return {
    currency: 'MZN',
    amountMinor: amountMzn * 100,
    label: 'exact',
    vatIncluded: false,
    effectiveFrom: null,
    effectiveUntil: null,
  };
}

function warranty(label) {
  if (label === '1 ano') return { duration: 12, unit: 'months', sourceLabel: label };
  if (label === '3 meses') return { duration: 3, unit: 'months', sourceLabel: label };
  if (label === '14 dias') return { duration: 14, unit: 'days', sourceLabel: label };
  return null;
}

function internalSku(brand, model, specification) {
  const fingerprint = createHash('sha256').update(specification).digest('hex').slice(0, 6);
  return `TMP-${slug(brand).slice(0, 3).toUpperCase()}-${slug(model).toUpperCase()}-${fingerprint}`;
}

function localizedContent(eyebrow, description) {
  return {
    en: { eyebrow, description, status: 'approved' },
    'pt-MZ': { eyebrow: null, description: null, status: 'draft' },
  };
}

function groupBy(values, keyForValue) {
  const groups = new Map();
  for (const value of values) {
    const key = keyForValue(value);
    groups.set(key, [...(groups.get(key) ?? []), value]);
  }
  return groups;
}

function withoutBrandPrefix(brand, title) {
  const prefix = `${brand} `;
  return title.toLowerCase().startsWith(prefix.toLowerCase()) ? title.slice(prefix.length) : title;
}

function baseProduct({ brand, title, category, content, placements, variants }) {
  const titleSlug = slug(title);
  return {
    id: titleSlug.startsWith(`${slug(brand)}-`) ? titleSlug : `${slug(brand)}-${titleSlug}`,
    slug: titleSlug,
    status: 'published',
    brand,
    title: withoutBrandPrefix(brand, title),
    content,
    category,
    media: null,
    availability: null,
    pricing: null,
    scheduledPrices: [],
    variants,
    placements,
    navigation: { featured: false, order: null },
    cardTone: 'default',
    updatedAt,
  };
}

function upsertProduct(product) {
  const existingIndex = catalog.findIndex(({ id }) => id === product.id);
  if (existingIndex === -1) catalog.push(product);
  else catalog[existingIndex] = product;
}

function smartphoneVariant([brand, model, storage, ram, network, amount, warrantyLabel, note]) {
  const existingSku =
    brand === 'Samsung'
      ? `SAM-${model.replace('Galaxy ', '').toUpperCase()}-${storage.replace('GB', '')}-${ram.replace('GB', '')}-${network}`
      : null;
  const redmiCodes = {
    'Redmi A5': 'A5',
    'Redmi A7': 'A7',
    'Redmi A7 Pro': 'A7P',
    'Redmi 9T': '9T',
    'Redmi 15C': '15C',
    'Redmi 15': '15',
    'Redmi Note 7 Pro': 'N7P',
    'Redmi Note 10 5G': 'N10',
    'Redmi Note 11E': 'N11E',
    'Redmi Note 12 Pro 5G': 'N12P',
    'Redmi Note 13 Pro': 'N13P',
    'Redmi Note 14': 'N14',
    'Redmi Note 14S': 'N14S',
    'Redmi Note 14 Pro': 'N14P',
  };
  const redmiSku = `RED-${redmiCodes[model]}-${storage.replace('GB', '')}-${ram.replace('GB', '')}${network ? `-${network}` : ''}`;
  return {
    status: 'active',
    sku: existingSku ?? redmiSku,
    storage,
    ram,
    network,
    warranty: warranty(warrantyLabel),
    condition: note.includes('Reforb') ? 'refurbished' : note.includes('Novo') ? 'new' : null,
    specifications: null,
    merchandising: { isPromotion: note.includes('Promoção') },
    availability: null,
    pricing: price(amount),
    scheduledPrices: [],
  };
}

const incomingSamsung = smartphoneRows.filter(([brand]) => brand === 'Samsung');
for (const row of incomingSamsung) {
  const [, model, storage, ram, network] = row;
  const product = catalog.find(
    (candidate) => candidate.brand === 'Samsung' && candidate.title === model
  );
  if (!product) throw new Error(`Missing existing Samsung product ${model}`);
  const variant = product.variants.find(
    (candidate) =>
      candidate.storage === storage && candidate.ram === ram && candidate.network === network
  );
  if (!variant) throw new Error(`Missing existing Samsung variant ${model} ${storage}/${ram}`);
  Object.assign(variant, smartphoneVariant(row));
  product.updatedAt = updatedAt;
}

const redmiGroups = groupBy(
  smartphoneRows.filter(([brand]) => brand === 'Redmi'),
  ([, model]) => model
);
let phoneOrder = 12;
for (const [model, rows] of redmiGroups) {
  const variants = rows.map(smartphoneVariant);
  const storageValues = [...new Set(variants.map(({ storage }) => storage))].join(' or ');
  const ramValues = [...new Set(variants.map(({ ram }) => ram))].join(' or ');
  const refurbished = variants.some(({ condition }) => condition === 'refurbished');
  upsertProduct(
    baseProduct({
      brand: 'Redmi',
      title: model,
      category: 'phones',
      content: localizedContent(
        refurbished ? 'Refurbished value' : 'Everyday smartphone value',
        `${refurbished ? 'A refurbished' : 'A'} Redmi smartphone with ${storageValues} of storage and ${ramValues} of RAM.`
      ),
      placements: [{ section: 'favorites', order: phoneOrder++ }],
      variants,
    })
  );
}

function computerBrand(sectionBrand, model) {
  if (sectionBrand === 'All-in-One') return 'HP';
  if (sectionBrand !== 'Outras Marcas') return sectionBrand.replace(/^Desktops /, '');
  return model.split(' ')[0] === 'ASUS' ? 'ASUS' : model.split(' ')[0];
}

function parseComputerRows(source) {
  let category = null;
  let sectionBrand = null;
  const rows = [];
  for (const rawLine of source.split(/\r?\n/)) {
    if (rawLine.startsWith('#### 1.')) category = 'laptop';
    if (rawLine.startsWith('#### 2.')) category = 'desktop';
    if (rawLine.startsWith('#### 3.')) category = 'accessory';
    if (rawLine.startsWith('##### ')) sectionBrand = rawLine.slice(6).trim();
    if (!rawLine.startsWith('- ')) continue;
    const line = rawLine.slice(2);
    const firstSeparator = line.indexOf(' - ');
    const lastSeparator = line.lastIndexOf(' - ');
    const model = line.slice(0, firstSeparator).trim();
    const specification = line.slice(firstSeparator + 3, lastSeparator).trim();
    const priceText = line.slice(lastSeparator + 3);
    const amount = Number(priceText.match(/[\d.]+/)?.[0].replaceAll('.', ''));
    rows.push({ category, sectionBrand, model, specification, amount });
  }
  return rows;
}

function computerSpecifications(specification) {
  const parts = specification.split(',').map((part) => part.trim());
  const processor = parts[0] ?? null;
  const display = parts.find((part) => part.includes('"')) ?? null;
  const operatingSystem = parts.find((part) => /Win |FreeDOS/i.test(part)) ?? null;
  const graphics = parts.find((part) => /Nvidia|RTX/i.test(part)) ?? null;
  const colour = parts.find((part) => /\b(Silver|Blue)\b/i.test(part)) ?? null;
  const keyboard = parts.find((part) => /Teclado/i.test(part)) ?? null;
  const includedItems = specification.includes('+ Monitor 22"') ? ['22-inch monitor'] : [];
  return { processor, display, operatingSystem, graphics, colour, keyboard, includedItems };
}

const computerRows = parseComputerRows(computerSource);
if (smartphoneRows.length !== 37 || computerRows.length !== 69) {
  throw new Error(
    `Unexpected source totals: ${smartphoneRows.length} smartphones and ${computerRows.length} computer/accessory rows.`
  );
}
const computerGroups = groupBy(computerRows, (row) => {
  const brand =
    row.category === 'accessory' ? 'Targus' : computerBrand(row.sectionBrand, row.model);
  return `${brand}|${row.model}`;
});
let computerOrder = 20;
let desktopOrder = 30;
let accessoryOrder = 20;
for (const [, rows] of computerGroups) {
  const first = rows[0];
  const brand =
    first.category === 'accessory' ? 'Targus' : computerBrand(first.sectionBrand, first.model);
  const category = first.category === 'accessory' ? 'accessories' : 'computers';
  const variants = rows.map(({ model, specification, amount }) => ({
    status: 'active',
    sku: internalSku(brand, model, specification),
    storage: specification.match(/(\d+(?:GB|TB)) SSD/i)?.[1] ?? null,
    ram: specification.match(/(\d+GB) RAM/i)?.[1] ?? null,
    network: null,
    warranty: null,
    condition: null,
    specifications: first.category === 'accessory' ? null : computerSpecifications(specification),
    merchandising: { isPromotion: false },
    availability: null,
    pricing: price(amount),
    scheduledPrices: [],
  }));
  const placement =
    first.category === 'laptop'
      ? { section: 'services', order: computerOrder++ }
      : first.category === 'desktop'
        ? { section: 'possibilities', order: desktopOrder++ }
        : { section: 'accessories', order: accessoryOrder++ };
  const description =
    first.category === 'accessory'
      ? `A Targus backpack offered in the listed configuration.`
      : `A ${brand} ${first.category === 'laptop' ? 'laptop' : 'computer'} available in the listed processor, memory, storage and display configurations.`;
  upsertProduct(
    baseProduct({
      brand,
      title: first.model,
      category,
      content: localizedContent(
        first.category === 'accessory' ? 'Carry your technology' : 'Configured for your needs',
        description
      ),
      placements: [placement],
      variants,
    })
  );
}

const featuredIds = [
  'lenovo-thinkpad-x1-carbon-gen-13',
  'hp-zbook-firefly-14-g11',
  'dell-alienware-16x-aurora-ac16251',
  'samsung-galaxy-a06',
  'samsung-galaxy-a17',
  'samsung-galaxy-a37',
  'samsung-galaxy-a57',
  'apple-iphone-pro',
  'apple-iphone',
  'redmi-a5',
  'redmi-note-14-pro',
  'targus-tbb565gl-74',
];
const featuredOrder = new Map(featuredIds.map((id, index) => [id, index]));
const incomingSamsungSkus = new Set(incomingSamsung.map((row) => smartphoneVariant(row).sku));
const accessoryMerchandising = {
  'targus-tbb565gl-74': {
    title: 'Intellect',
    description: 'A lightweight laptop backpack with padded protection and quick-access storage.',
  },
  'targus-cn600gl-70': {
    title: 'EcoSmart',
    description:
      'A water-resistant laptop backpack with recycled materials and everyday organization.',
  },
  'targus-tbb943gl': {
    title: 'Modern Classic',
    description: 'A structured laptop backpack with padded protection and practical organization.',
  },
  'targus-tbb013eu-74-eco-spruce': {
    title: 'EcoSpruce',
    description: 'A recycled-material laptop backpack with organized storage for everyday travel.',
  },
};

for (const product of catalog) {
  const merchandising = accessoryMerchandising[product.id];
  if (merchandising) {
    product.title = merchandising.title;
    product.content.en.description = merchandising.description;
  }

  const archived = product.updatedAt !== updatedAt;

  if (archived) {
    product.status = 'archived';
    product.availability = 'discontinued';
    product.placements = [];
  }

  product.variants = product.variants.map((variant) => {
    const variantArchived =
      archived || (product.brand === 'Samsung' && !incomingSamsungSkus.has(variant.sku));

    return {
      ...variant,
      status: variantArchived ? 'archived' : 'active',
      availability: variantArchived ? 'discontinued' : variant.availability,
    };
  });

  product.navigation = {
    featured: !archived && featuredOrder.has(product.id),
    order: !archived ? (featuredOrder.get(product.id) ?? null) : null,
  };
}

const variantCount = catalog.flatMap(({ variants }) => variants).length;
const activeProducts = catalog.filter(({ status }) => status === 'published');
const activeVariantCount = activeProducts.flatMap(({ variants }) =>
  variants.filter(({ status }) => status === 'active')
).length;
if (catalog.length !== 116 || variantCount !== 124) {
  throw new Error(
    `Unexpected candidate totals: ${catalog.length} products and ${variantCount} variants.`
  );
}
if (activeProducts.length !== 82 || activeVariantCount !== 106) {
  throw new Error(
    `Unexpected active totals: ${activeProducts.length} products and ${activeVariantCount} variants.`
  );
}

await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(
  `Candidate written: ${activeProducts.length} active products, ${activeVariantCount} active variants, ${catalog.length - activeProducts.length} archived products, ${computerRows.length + smartphoneRows.length} incoming rows, 1 incomplete row quarantined.`
);
