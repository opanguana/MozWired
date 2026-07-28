import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { CatalogProduct } from './schema';
import type { CatalogValidationIssue } from './validation';

export function validateCatalogMedia(
  products: CatalogProduct[],
  publicDirectory = join(process.cwd(), 'public')
): CatalogValidationIssue[] {
  return products.flatMap((product) =>
    (product.media?.images ?? []).flatMap((image, index) => {
      const imagePath = join(publicDirectory, image.src.replace(/^\/+/, ''));
      return existsSync(imagePath)
        ? []
        : [
            {
              product: product.id,
              path: `media.images.${index}.src`,
              message: `Image does not exist: ${image.src}`,
            },
          ];
    })
  );
}
