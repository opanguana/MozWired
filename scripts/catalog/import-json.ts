import { readFile, rename, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import { validateCatalogMedia } from '../../catalog/media-validation';
import type { CatalogProduct, CatalogVariant } from '../../catalog/schema';
import { validateCatalog } from '../../catalog/validation';

function archiveVariant(variant: CatalogVariant): CatalogVariant {
  return { ...variant, status: 'archived', availability: 'discontinued' };
}

function archiveProduct(product: CatalogProduct): CatalogProduct {
  return {
    ...product,
    status: 'archived',
    availability: 'discontinued',
    placements: [],
    navigation: { featured: false, order: null },
    variants: product.variants.map(archiveVariant),
  };
}

function reconcileSnapshot(current: CatalogProduct[], incoming: CatalogProduct[]) {
  const currentById = new Map(current.map((product) => [product.id, product]));
  const incomingIds = new Set(incoming.map((product) => product.id));
  const archivedProductIds = current
    .filter((product) => product.status !== 'archived' && !incomingIds.has(product.id))
    .map((product) => product.id);
  const archivedVariantSkus: string[] = [];

  const reconciled = incoming.map((product) => {
    const existing = currentById.get(product.id);
    if (!existing) return product;

    const incomingSkus = new Set(product.variants.map(({ sku }) => sku));
    const missingVariants = existing.variants
      .filter(({ status, sku }) => status !== 'archived' && !incomingSkus.has(sku))
      .map((variant) => {
        archivedVariantSkus.push(variant.sku);
        return archiveVariant(variant);
      });

    return { ...product, variants: [...product.variants, ...missingVariants] };
  });

  current
    .filter((product) => !incomingIds.has(product.id))
    .forEach((product) => reconciled.push(archiveProduct(product)));

  return { reconciled, archivedProductIds, archivedVariantSkus };
}

async function main() {
  const args = process.argv.slice(2);
  const sourceArgument = args.find((argument) => !argument.startsWith('--'));
  const apply = args.includes('--apply');
  const snapshotMode = args.includes('--mode=snapshot');
  const acknowledgeArchives = args.includes('--acknowledge-archives');

  if (!sourceArgument) {
    throw new Error(
      'Usage: npm run catalog:import -- <catalog.json> [--apply] ' +
        '[--mode=snapshot --acknowledge-archives]'
    );
  }

  const sourcePath = resolve(sourceArgument);
  const targetPath = join(process.cwd(), 'data/catalog-source.json');
  const candidate = JSON.parse(await readFile(sourcePath, 'utf8')) as unknown;
  const incomingValidation = validateCatalog(candidate);
  incomingValidation.issues.push(...validateCatalogMedia(incomingValidation.products));

  if (incomingValidation.issues.length) {
    throw new Error(
      incomingValidation.issues
        .map(({ product, path, message }) => `[${product}] ${path}: ${message}`)
        .join('\n')
    );
  }

  let currentProducts: CatalogProduct[] = [];
  try {
    const current = JSON.parse(await readFile(targetPath, 'utf8')) as unknown;
    currentProducts = validateCatalog(current).products;
  } catch {
    // A first import has no previous catalogue to compare.
  }

  const plan = snapshotMode
    ? reconcileSnapshot(currentProducts, incomingValidation.products)
    : {
        reconciled: incomingValidation.products,
        archivedProductIds: [] as string[],
        archivedVariantSkus: [] as string[],
      };
  const validation = validateCatalog(plan.reconciled);
  validation.issues.push(...validateCatalogMedia(validation.products));
  if (validation.issues.length) {
    throw new Error(
      validation.issues
        .map(({ product, path, message }) => `[${product}] ${path}: ${message}`)
        .join('\n')
    );
  }

  const incomingIds = new Set(incomingValidation.products.map(({ id }) => id));
  const omittedIds = currentProducts.filter(({ id }) => !incomingIds.has(id)).map(({ id }) => id);

  if (!snapshotMode && omittedIds.length) {
    throw new Error(
      `Replacement input omits ${omittedIds.length} existing product(s). ` +
        'Use --mode=snapshot to archive omissions safely.'
    );
  }

  console.log(
    `${apply ? 'Apply' : 'Dry run'} (${snapshotMode ? 'snapshot' : 'replacement'}): ` +
      `${validation.products.length} retained product records from ${basename(sourcePath)}.`
  );

  if (plan.archivedProductIds.length) {
    console.log(`Products to archive (${plan.archivedProductIds.length}):`);
    plan.archivedProductIds.forEach((id) => console.log(`- ${id}`));
  }
  if (plan.archivedVariantSkus.length) {
    console.log(`Variants to archive (${plan.archivedVariantSkus.length}):`);
    plan.archivedVariantSkus.forEach((sku) => console.log(`- ${sku}`));
  }

  if ((plan.archivedProductIds.length || plan.archivedVariantSkus.length) && !acknowledgeArchives) {
    throw new Error('Review the archival plan and pass --acknowledge-archives explicitly.');
  }

  if (!apply) {
    console.log('No files changed. Re-run with --apply after review.');
    return;
  }

  const temporaryPath = `${targetPath}.tmp-${process.pid}`;
  await writeFile(temporaryPath, `${JSON.stringify(validation.products, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, targetPath);
  console.log(`Published atomically to ${targetPath}. Commit the reviewed diff to deploy it.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
