import { z } from 'zod';

export const CategoryDtoSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  product_count: z.number(),
});

export const CategoryListDtoSchema = z.array(CategoryDtoSchema);

export type CategoryDto = z.infer<typeof CategoryDtoSchema>;
