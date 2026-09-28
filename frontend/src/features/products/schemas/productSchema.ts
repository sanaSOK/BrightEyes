import { z } from 'zod';

export const PriceTierDtoSchema = z.object({
  min_quantity: z.number(),
  max_quantity: z.number().optional(),
  unit_price: z.number(),
});

export const VariantDtoSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  color: z.string().optional(),
  size: z.string().optional(),
  lens_type: z.string().optional(),
  stock: z.number(),
  price_offset: z.number().optional(),
  image_url: z.string().optional(),
});

export const SupplierDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  verified: z.boolean(),
  country_of_origin: z.string(),
  lead_time_days: z.number(),
  logo_url: z.string().optional(),
});

export const ShippingHighlightDtoSchema = z.object({
  icon: z.string().optional(),
  text: z.string(),
});

export const DealProgressDtoSchema = z.object({
  claimed_percent: z.number(),
  units_left: z.number(),
});

export const ProductDtoSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category_id: z.string(),
  category_name: z.string(),
  images: z.array(z.string()),
  supplier: SupplierDtoSchema,
  moq: z.number(),
  quantity_step: z.number(),
  price_tiers: z.array(PriceTierDtoSchema),
  variants: z.array(VariantDtoSchema),
  attributes: z.record(z.union([z.string(), z.number(), z.array(z.string())])),
  price_visibility: z.enum(['public', 'approved_only']),
  total_stock: z.number(),
  rating: z.number().optional(),
  rating_count: z.number().optional(),
  sold_count: z.number().optional(),
  compare_at_price: z.number().optional(),
  discount_percent: z.number().optional(),
  badges: z.array(z.string()).optional(),
  shipping_highlight: ShippingHighlightDtoSchema.optional(),
  deal_progress: DealProgressDtoSchema.optional(),
  created_at: z.string(),
});

export const AttributeDefinitionDtoSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['select', 'range', 'multi-select']),
  options: z.array(z.union([z.string(), z.number()])),
});

export const PaginatedProductsDtoSchema = z.object({
  items: z.array(ProductDtoSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  total_pages: z.number(),
  available_attributes: z.array(AttributeDefinitionDtoSchema),
});

export type PriceTierDto = z.infer<typeof PriceTierDtoSchema>;
export type VariantDto = z.infer<typeof VariantDtoSchema>;
export type SupplierDto = z.infer<typeof SupplierDtoSchema>;
export type ProductDto = z.infer<typeof ProductDtoSchema>;
export type PaginatedProductsDto = z.infer<typeof PaginatedProductsDtoSchema>;
