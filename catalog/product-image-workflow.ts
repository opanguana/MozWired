import type { CatalogImage, CatalogProduct } from './schema';

export const supportedProductImageExtensions = ['.avif', '.jpg', '.jpeg', '.png', '.webp'] as const;

export type ProductImageRole = CatalogImage['role'];

export type ProductImagePlan = {
  product: CatalogProduct;
  image: CatalogImage;
  publicPath: string;
};

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function planProductImageUpdate({
  product,
  extension,
  role,
  alt,
  updatedAt,
}: {
  product: CatalogProduct;
  extension: string;
  role: ProductImageRole;
  alt?: string;
  updatedAt: string;
}): ProductImagePlan {
  const inputExtension = extension.toLowerCase();
  if (!supportedProductImageExtensions.some((candidate) => candidate === inputExtension)) {
    throw new Error(`Unsupported image extension "${extension}". Use AVIF, JPG, PNG, or WebP.`);
  }
  const normalizedExtension = inputExtension === '.jpeg' ? '.jpg' : inputExtension;
  const existingImages = product.media?.images ?? [];
  if (role === 'gallery' && !product.media) {
    throw new Error('Add a main image before adding gallery images.');
  }
  const currentMain = existingImages.find((image) => image.id === product.media?.primaryImageId);
  const sortOrder =
    role === 'main'
      ? (currentMain?.sortOrder ?? 0)
      : Math.max(-1, ...existingImages.map((image) => image.sortOrder)) + 1;
  const imageId =
    role === 'main'
      ? (currentMain?.id ?? `${product.id}-main`)
      : `${product.id}-gallery-${sortOrder}`;
  const filename =
    role === 'main' ? `main${normalizedExtension}` : `gallery-${sortOrder}${normalizedExtension}`;
  const publicPath = `/images/products/${slugify(product.brand)}/${product.slug}/${filename}`;
  const image: CatalogImage = {
    id: imageId,
    role,
    src: publicPath,
    alt: alt?.trim() || currentMain?.alt || `${product.brand} ${product.title} product image`,
    sortOrder,
  };
  const images =
    role === 'main'
      ? [image, ...existingImages.filter((existing) => existing.id !== currentMain?.id)]
      : [...existingImages, image];

  return {
    image,
    publicPath,
    product: {
      ...product,
      media: {
        primaryImageId: role === 'main' ? image.id : (product.media?.primaryImageId ?? image.id),
        images,
      },
      updatedAt,
    },
  };
}
