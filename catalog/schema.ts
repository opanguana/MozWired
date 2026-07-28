import { z } from 'zod';

const isoDateWithTimezone = z
  .string()
  .refine(
    (value) => /(Z|[+-]\d{2}:\d{2})$/.test(value) && !Number.isNaN(Date.parse(value)),
    'Use a valid ISO 8601 date with an explicit timezone.'
  );

export const catalogCategorySchema = z.enum([
  'computers',
  'phones',
  'mobile',
  'audio',
  'accessories',
]);

export const availabilitySchema = z
  .enum(['in_stock', 'low_stock', 'out_of_stock', 'preorder', 'discontinued', 'price_on_request'])
  .nullable();

export const catalogPriceSchema = z
  .object({
    currency: z.literal('MZN'),
    amountMinor: z.number().int().nonnegative().safe(),
    label: z.enum(['exact', 'from']),
    vatIncluded: z.literal(false),
    effectiveFrom: isoDateWithTimezone.nullable(),
    effectiveUntil: isoDateWithTimezone.nullable(),
  })
  .superRefine((price, context) => {
    if (
      price.effectiveFrom &&
      price.effectiveUntil &&
      Date.parse(price.effectiveUntil) <= Date.parse(price.effectiveFrom)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['effectiveUntil'],
        message: 'effectiveUntil must be later than effectiveFrom.',
      });
    }
  });

export const catalogVariantSchema = z.object({
  sku: z.string().trim().min(1),
  storage: z.string().trim().min(1).nullable(),
  ram: z.string().trim().min(1).nullable(),
  network: z.enum(['4G', '5G']).nullable(),
  availability: availabilitySchema,
  pricing: catalogPriceSchema.nullable(),
  scheduledPrices: z.array(catalogPriceSchema).default([]),
});

export const catalogPlacementSchema = z.object({
  section: z.enum([
    'services',
    'favorites',
    'savings',
    'benefits',
    'accessories',
    'possibilities',
    'more-to-love',
    'experience',
  ]),
  order: z.number().int().nonnegative(),
});

export const catalogImageSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  role: z.enum(['main', 'gallery']),
  src: z.string().regex(/^\/images\/[a-zA-Z0-9/_\-.]+$/),
  alt: z.string().trim().min(1),
  sortOrder: z.number().int().nonnegative(),
});

export const catalogMediaSchema = z
  .object({
    primaryImageId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    images: z.array(catalogImageSchema).min(1),
  })
  .superRefine((media, context) => {
    const ids = new Set<string>();
    const orders = new Set<number>();

    media.images.forEach((image, index) => {
      if (ids.has(image.id)) {
        context.addIssue({
          code: 'custom',
          path: ['images', index, 'id'],
          message: 'Image IDs must be unique within a product.',
        });
      }
      ids.add(image.id);

      if (orders.has(image.sortOrder)) {
        context.addIssue({
          code: 'custom',
          path: ['images', index, 'sortOrder'],
          message: 'Image sort orders must be unique within a product.',
        });
      }
      orders.add(image.sortOrder);
    });

    const primary = media.images.find(({ id }) => id === media.primaryImageId);
    if (!primary) {
      context.addIssue({
        code: 'custom',
        path: ['primaryImageId'],
        message: 'primaryImageId must reference an image in this product.',
      });
    } else if (primary.role !== 'main') {
      context.addIssue({
        code: 'custom',
        path: ['primaryImageId'],
        message: 'The primary image must use the main role.',
      });
    }
  });

export const catalogProductSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(['draft', 'published']),
  brand: z.string().trim().min(1),
  title: z.string().trim().min(1),
  eyebrow: z.string().trim().min(1),
  description: z.string().trim().min(1),
  category: catalogCategorySchema,
  media: catalogMediaSchema.nullable(),
  availability: availabilitySchema,
  pricing: catalogPriceSchema.nullable(),
  scheduledPrices: z.array(catalogPriceSchema).default([]),
  variants: z.array(catalogVariantSchema),
  placements: z.array(catalogPlacementSchema),
  cardTone: z.enum(['default', 'dark', 'warm']),
  updatedAt: isoDateWithTimezone,
});

export const catalogSourceSchema = z.array(catalogProductSchema);

export type CatalogCategory = z.infer<typeof catalogCategorySchema>;
export type CatalogAvailability = z.infer<typeof availabilitySchema>;
export type CatalogPrice = z.infer<typeof catalogPriceSchema>;
export type CatalogVariant = z.infer<typeof catalogVariantSchema>;
export type CatalogPlacement = z.infer<typeof catalogPlacementSchema>;
export type CatalogImage = z.infer<typeof catalogImageSchema>;
export type CatalogMedia = z.infer<typeof catalogMediaSchema>;
export type CatalogProduct = z.infer<typeof catalogProductSchema>;
