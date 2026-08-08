import { readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  arrangeHomepageSection,
  getHomepageSectionSlugs,
  homepageSections,
  type HomepageSection,
} from '../../catalog/homepage-placement';
import { assertValidCatalog } from '../../catalog/validation';

async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const valueFor = (name: string) => {
    const inline = args.find((argument) => argument.startsWith(`${name}=`));
    if (inline) return inline.slice(name.length + 1);
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };

  const sectionValue = valueFor('--section');
  const productsValue = valueFor('--products');

  if (!homepageSections.includes(sectionValue as HomepageSection) || !productsValue) {
    throw new Error(
      `Usage: npm run homepage:arrange -- --section <${homepageSections.join('|')}> ` +
        '--products <slug,slug,...> [--apply]'
    );
  }

  const section = sectionValue as HomepageSection;
  const promotedSlugs = productsValue
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean);
  const catalogPath = join(process.cwd(), 'data/catalog-source.json');
  const source = JSON.parse(await readFile(catalogPath, 'utf8')) as unknown;
  const products = assertValidCatalog(source);
  const before = getHomepageSectionSlugs(products, section);
  const candidate = arrangeHomepageSection(products, section, promotedSlugs);
  assertValidCatalog(candidate);
  const after = getHomepageSectionSlugs(candidate, section);

  console.log(`Homepage section: ${section}`);
  console.log(`Before: ${before.join(', ')}`);
  console.log(`After:  ${after.join(', ')}`);

  if (!apply) {
    console.log('Dry run only. Repeat with --apply to update the catalogue.');
    return;
  }

  const temporaryPath = `${catalogPath}.tmp-${process.pid}`;
  await writeFile(temporaryPath, `${JSON.stringify(candidate, null, 2)}\n`);
  await rename(temporaryPath, catalogPath);
  console.log('Homepage ordering updated. Review and commit the catalogue diff.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
