import catalogSource from '../../data/catalog-source.json';
import { validateCatalogMedia } from '../../catalog/media-validation';
import { validateCatalog } from '../../catalog/validation';

const result = validateCatalog(catalogSource);
result.issues.push(...validateCatalogMedia(result.products));

if (result.issues.length) {
  result.issues.forEach(({ product, path, message }) => {
    console.error(`[${product}] ${path}: ${message}`);
  });
  process.exitCode = 1;
} else {
  const variants = result.products.reduce((total, product) => total + product.variants.length, 0);
  const activeProducts = result.products.filter(({ status }) => status === 'published');
  const activeVariants = activeProducts.flatMap(({ variants: productVariants }) =>
    productVariants.filter(({ status }) => status === 'active')
  );
  console.log(
    `Catalogue valid: ${activeProducts.length} active products, ${activeVariants.length} active variants; ` +
      `${result.products.length - activeProducts.length} archived products, ` +
      `${variants - activeVariants.length} archived variants.`
  );
}
