import { z } from 'zod';

export const RfqItemDtoSchema = z.object({
  product_id: z.string(),
  product_title: z.string(),
  variant_id: z.string().optional(),
  variant_sku: z.string().optional(),
  quantity: z.number(),
  target_unit_price: z.number().optional(),
});

export const RfqDtoSchema = z.object({
  id: z.string(),
  reference_no: z.string(),
  company_name: z.string(),
  contact_email: z.string(),
  contact_phone: z.string().optional(),
  shipping_country: z.string(),
  request_type: z.enum(['quote', 'sample']).optional().default('quote'),
  items: z.array(RfqItemDtoSchema),
  target_lead_time_days: z.number().optional(),
  notes: z.string().optional(),
  status: z.enum(['submitted', 'under_review', 'quoted', 'rejected']),
  created_at: z.string(),
});

export const CreateRfqDtoSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  contact_email: z.string().email('Invalid email address'),
  contact_phone: z.string().optional(),
  shipping_country: z.string().min(1, 'Shipping country is required'),
  request_type: z.enum(['quote', 'sample']).optional().default('quote'),
  items: z.array(RfqItemDtoSchema).min(1, 'At least one product item is required'),
  target_lead_time_days: z.number().optional(),
  notes: z.string().optional(),
});

export const PaginatedRfqsDtoSchema = z.object({
  items: z.array(RfqDtoSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  total_pages: z.number(),
});

export type RfqItemDto = z.infer<typeof RfqItemDtoSchema>;
export type RfqDto = z.infer<typeof RfqDtoSchema>;
export type CreateRfqDto = z.infer<typeof CreateRfqDtoSchema>;
export type PaginatedRfqsDto = z.infer<typeof PaginatedRfqsDtoSchema>;
