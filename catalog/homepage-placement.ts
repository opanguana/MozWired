import type { CatalogPlacement, CatalogProduct } from './schema';

export const homepageSections = [
  'services',
  'favorites',
  'accessories',
  'possibilities',
] as const satisfies readonly CatalogPlacement['section'][];

export type HomepageSection = (typeof homepageSections)[number];

function placementOrder(product: CatalogProduct, section: HomepageSection) {
  return product.placements.find((placement) => placement.section === section)?.order;
}

export function getHomepageSectionSlugs(
  products: CatalogProduct[],
  section: HomepageSection
) {
  return products
    .filter((product) => placementOrder(product, section) !== undefined)
    .sort((left, right) => placementOrder(left, section)! - placementOrder(right, section)!)
    .map(({ slug }) => slug);
}

export function arrangeHomepageSection(
  products: CatalogProduct[],
  section: HomepageSection,
  promotedSlugs: string[]
) {
  if (!promotedSlugs.length) throw new Error('Provide at least one product slug.');
  if (new Set(promotedSlugs).size !== promotedSlugs.length) {
    throw new Error('Product slugs must be unique.');
  }

  const currentSlugs = getHomepageSectionSlugs(products, section);
  const currentSlugSet = new Set(currentSlugs);
  const missing = promotedSlugs.filter((slug) => !currentSlugSet.has(slug));
  if (missing.length) {
    throw new Error(
      `Products are not currently assigned to ${section}: ${missing.join(', ')}`
    );
  }

  const promotedSlugSet = new Set(promotedSlugs);
  const orderedSlugs = [
    ...promotedSlugs,
    ...currentSlugs.filter((slug) => !promotedSlugSet.has(slug)),
  ];
  const orderBySlug = new Map(orderedSlugs.map((slug, order) => [slug, order]));

  return products.map((product) => {
    const order = orderBySlug.get(product.slug);
    if (order === undefined) return product;

    return {
      ...product,
      placements: product.placements.map((placement) =>
        placement.section === section ? { ...placement, order } : placement
      ),
    };
  });
}
