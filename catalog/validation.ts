import type { ZodIssue } from 'zod';

import { catalogProductSchema, type CatalogPrice, type CatalogProduct } from './schema';

export type CatalogValidationIssue = {
  product: string;
  path: string;
  message: string;
};

function formatZodIssue(product: string, issue: ZodIssue): CatalogValidationIssue {
  return {
    product,
    path: issue.path.join('.') || 'product',
    message: issue.message,
  };
}

function priceWindowsOverlap(left: CatalogPrice, right: CatalogPrice) {
  const leftStart = left.effectiveFrom ? Date.parse(left.effectiveFrom) : Number.NEGATIVE_INFINITY;
  const leftEnd = left.effectiveUntil ? Date.parse(left.effectiveUntil) : Number.POSITIVE_INFINITY;
  const rightStart = right.effectiveFrom
    ? Date.parse(right.effectiveFrom)
    : Number.NEGATIVE_INFINITY;
  const rightEnd = right.effectiveUntil
    ? Date.parse(right.effectiveUntil)
    : Number.POSITIVE_INFINITY;

  return leftStart < rightEnd && rightStart < leftEnd;
}

function findOverlappingPrices(
  product: string,
  path: string,
  prices: CatalogPrice[]
): CatalogValidationIssue[] {
  const issues: CatalogValidationIssue[] = [];

  for (let left = 0; left < prices.length; left += 1) {
    for (let right = left + 1; right < prices.length; right += 1) {
      if (priceWindowsOverlap(prices[left], prices[right])) {
        issues.push({
          product,
          path,
          message: `Scheduled price windows ${left + 1} and ${right + 1} overlap.`,
        });
      }
    }
  }

  return issues;
}

export function validateCatalog(input: unknown) {
  if (!Array.isArray(input)) {
    return {
      products: [] as CatalogProduct[],
      issues: [{ product: 'catalog', path: 'catalog', message: 'Catalogue must be an array.' }],
    };
  }

  const products: CatalogProduct[] = [];
  const issues: CatalogValidationIssue[] = [];

  input.forEach((candidate, index) => {
    const result = catalogProductSchema.safeParse(candidate);
    const productLabel =
      typeof candidate === 'object' &&
      candidate !== null &&
      'id' in candidate &&
      typeof candidate.id === 'string'
        ? candidate.id
        : `record-${index + 1}`;

    if (!result.success) {
      issues.push(...result.error.issues.map((issue) => formatZodIssue(productLabel, issue)));
      return;
    }

    products.push(result.data);
  });

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenSkus = new Set<string>();

  products.forEach((product) => {
    if (seenIds.has(product.id)) {
      issues.push({ product: product.id, path: 'id', message: 'Duplicate product ID.' });
    }
    seenIds.add(product.id);

    if (seenSlugs.has(product.slug)) {
      issues.push({ product: product.id, path: 'slug', message: 'Duplicate product slug.' });
    }
    seenSlugs.add(product.slug);

    issues.push(...findOverlappingPrices(product.id, 'scheduledPrices', product.scheduledPrices));

    const variantAxes = new Set<string>();
    product.variants.forEach((variant, index) => {
      if (seenSkus.has(variant.sku)) {
        issues.push({
          product: product.id,
          path: `variants.${index}.sku`,
          message: 'Duplicate SKU.',
        });
      }
      seenSkus.add(variant.sku);

      const axes = [
        variant.storage,
        variant.ram,
        variant.network,
        JSON.stringify(variant.specifications),
      ].join('|');
      if (variantAxes.has(axes)) {
        issues.push({
          product: product.id,
          path: `variants.${index}`,
          message: 'Duplicate variant storage/RAM/network combination.',
        });
      }
      variantAxes.add(axes);

      issues.push(
        ...findOverlappingPrices(
          product.id,
          `variants.${index}.scheduledPrices`,
          variant.scheduledPrices
        )
      );
    });

    if (
      product.status === 'archived' &&
      (product.availability !== 'discontinued' ||
        product.placements.length > 0 ||
        product.navigation.featured ||
        product.navigation.order !== null)
    ) {
      issues.push({
        product: product.id,
        path: 'status',
        message:
          'Archived products must be discontinued and excluded from placements and navigation.',
      });
    }

    product.variants.forEach((variant, index) => {
      if (variant.status === 'archived' && variant.availability !== 'discontinued') {
        issues.push({
          product: product.id,
          path: `variants.${index}.availability`,
          message: 'Archived variants must use discontinued availability.',
        });
      }
    });

    const placementKeys = new Set<string>();
    product.placements.forEach((placement, index) => {
      const key = `${placement.section}:${placement.order}`;
      if (placementKeys.has(key)) {
        issues.push({
          product: product.id,
          path: `placements.${index}`,
          message: 'Duplicate section placement.',
        });
      }
      placementKeys.add(key);
    });

    if (
      product.status === 'published' &&
      !product.pricing &&
      !product.variants.some(({ status, pricing }) => status === 'active' && pricing) &&
      product.availability !== 'price_on_request'
    ) {
      issues.push({
        product: product.id,
        path: 'pricing',
        message: 'Published products need a price or price_on_request availability.',
      });
    }
  });

  return { products, issues };
}

export function assertValidCatalog(input: unknown) {
  const result = validateCatalog(input);
  if (result.issues.length) {
    throw new Error(
      result.issues
        .map(({ product, path, message }) => `[${product}] ${path}: ${message}`)
        .join('\n')
    );
  }
  return result.products;
}
