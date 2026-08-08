import { getCatalog, groupCatalogProducts } from '@/catalog/load';
import { buildProductSearchIndex } from '@/catalog/search';

export const productSearchIndex = buildProductSearchIndex(groupCatalogProducts(getCatalog()));
