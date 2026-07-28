import { readFile, rename, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import { validateCatalogMedia } from '../../catalog/media-validation';
import { validateCatalog } from '../../catalog/validation';

async function main() {
  const args = process.argv.slice(2);
  const sourceArgument = args.find((argument) => !argument.startsWith('--'));
  const apply = args.includes('--apply');
  const allowRemovals = args.includes('--allow-removals');

  if (!sourceArgument) {
    throw new Error('Usage: npm run catalog:import -- <catalog.json> [--apply] [--allow-removals]');
  }

  const sourcePath = resolve(sourceArgument);
  const targetPath = join(process.cwd(), 'data/catalog-source.json');
  const candidate = JSON.parse(await readFile(sourcePath, 'utf8')) as unknown;
  const validation = validateCatalog(candidate);
  validation.issues.push(...validateCatalogMedia(validation.products));

  if (validation.issues.length) {
    throw new Error(
      validation.issues
        .map(({ product, path, message }) => `[${product}] ${path}: ${message}`)
        .join('\n')
    );
  }

  let currentIds = new Set<string>();
  try {
    const current = JSON.parse(await readFile(targetPath, 'utf8')) as unknown;
    currentIds = new Set(validateCatalog(current).products.map(({ id }) => id));
  } catch {
    // A first import has no previous catalogue to compare.
  }

  const nextIds = new Set(validation.products.map(({ id }) => id));
  const removedIds = [...currentIds].filter((id) => !nextIds.has(id));

  console.log(
    `${apply ? 'Apply' : 'Dry run'}: ${validation.products.length} products from ${basename(sourcePath)}.`
  );

  if (removedIds.length && !allowRemovals) {
    throw new Error(
      `Refusing to remove ${removedIds.length} product(s): ${removedIds.join(', ')}. ` +
        'Review the diff and pass --allow-removals explicitly.'
    );
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
