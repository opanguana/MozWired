import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { CatalogProduct } from './schema';
import type { CatalogValidationIssue } from './validation';

export function validateCatalogMedia(
  products: CatalogProduct[],
  publicDirectory = join(process.cwd(), 'public')
): CatalogValidationIssue[] {
  return products.flatMap((product) => {
    if (!product.image) return [];

    const imagePath = join(publicDirectory, product.image.src.replace(/^\/+/, ''));
    return existsSync(imagePath)
      ? []
      : [
          {
            product: product.id,
            path: 'image.src',
            message: `Image does not exist: ${product.image.src}`,
          },
        ];
  });
}
