import { constants } from 'node:fs';
import { access, copyFile, mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';

import {
  planProductImageUpdate,
  type ProductImageRole,
} from '../../catalog/product-image-workflow';
import { validateCatalog } from '../../catalog/validation';

const usage = `Usage:
  npm run images:update -- --product <slug> --file <path> [--alt <text>] [--role main|gallery]
  npm run images:update -- --product <slug> --file <path> [options] --apply [--replace]

The command is a dry run unless --apply is supplied. Use --replace only when the derived
destination already exists and you intentionally want to overwrite that image.`;

function option(args: string[], name: string) {
  const inline = args.find((argument) => argument.startsWith(`--${name}=`));
  if (inline) return inline.slice(name.length + 3);
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}

async function pathExists(path: string) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage);
    return;
  }

  const productSlug = option(args, 'product');
  const sourceArgument = option(args, 'file');
  const roleArgument = option(args, 'role') ?? 'main';
  const alt = option(args, 'alt');
  const apply = args.includes('--apply');
  const replace = args.includes('--replace');
  if (!productSlug || !sourceArgument || !['main', 'gallery'].includes(roleArgument)) {
    throw new Error(usage);
  }

  const sourcePath = resolve(sourceArgument);
  const sourceStats = await stat(sourcePath).catch(() => null);
  if (!sourceStats?.isFile() || sourceStats.size === 0) {
    throw new Error(`Image file is missing or empty: ${sourcePath}`);
  }

  const catalogPath = join(process.cwd(), 'data/catalog-source.json');
  const source = JSON.parse(await readFile(catalogPath, 'utf8')) as unknown;
  if (!Array.isArray(source)) throw new Error('The catalogue source must be a JSON array.');
  const validation = validateCatalog(source);
  if (validation.issues.length) {
    throw new Error('The existing catalogue is invalid. Run npm run catalog:validate for details.');
  }

  const productIndex = validation.products.findIndex(({ slug }) => slug === productSlug);
  if (productIndex < 0) throw new Error(`Unknown product slug "${productSlug}".`);

  const plan = planProductImageUpdate({
    product: validation.products[productIndex],
    extension: extname(sourcePath),
    role: roleArgument as ProductImageRole,
    alt,
    updatedAt: new Date().toISOString(),
  });
  const sourceProduct = source[productIndex];
  if (!sourceProduct || typeof sourceProduct !== 'object') {
    throw new Error(`Could not update the source record for "${productSlug}".`);
  }
  const candidateSource = [...source];
  candidateSource[productIndex] = {
    ...sourceProduct,
    media: plan.product.media,
    updatedAt: plan.product.updatedAt,
  };
  const candidateValidation = validateCatalog(candidateSource);
  if (candidateValidation.issues.length) {
    throw new Error(
      candidateValidation.issues
        .map(({ product, path, message }) => `[${product}] ${path}: ${message}`)
        .join('\n')
    );
  }

  const destinationPath = join(process.cwd(), 'public', plan.publicPath.replace(/^\/+/, ''));
  const samePath = sourcePath === destinationPath;
  const destinationExists = await pathExists(destinationPath);

  console.log(`${apply ? 'Apply' : 'Dry run'} product image update:`);
  console.log(`- Product: ${plan.product.brand} ${plan.product.title} (${plan.product.slug})`);
  console.log(`- Role: ${roleArgument}`);
  console.log(`- Source: ${sourcePath}`);
  console.log(`- Destination: ${destinationPath}`);
  console.log(`- Media ID: ${plan.image.id}`);
  console.log(`- Alt text: ${plan.image.alt}`);

  if (!apply) {
    console.log('No files changed. Review the plan, then repeat with --apply.');
    return;
  }
  if (destinationExists && !samePath && !replace) {
    throw new Error('Destination already exists. Pass --replace after reviewing the target.');
  }

  if (!samePath) {
    await mkdir(dirname(destinationPath), { recursive: true });
    const imageTemporaryPath = `${destinationPath}.tmp-${process.pid}`;
    await copyFile(sourcePath, imageTemporaryPath);
    await rename(imageTemporaryPath, destinationPath);
  }

  const catalogTemporaryPath = `${catalogPath}.tmp-${process.pid}`;
  await writeFile(catalogTemporaryPath, `${JSON.stringify(candidateSource, null, 2)}\n`);
  await rename(catalogTemporaryPath, catalogPath);
  console.log('Image and catalogue media updated. Review and commit both changes together.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
