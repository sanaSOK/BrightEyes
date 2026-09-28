import { httpClient } from '@/lib/api/httpClient';
import { CreateRfqInput, PaginatedRfqsResponse, RfqRequest } from '../types';
import { PaginatedRfqsDtoSchema, RfqDtoSchema } from '../schemas/rfqSchema';
import { mapPaginatedRfqsFromDto, mapRfqFromDto } from '../mappers/rfqMapper';

export const rfqService = {
  async list(params?: { page?: number; limit?: number; mock_error?: string }): Promise<PaginatedRfqsResponse> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const rawData = await httpClient<unknown>('/rfqs', {
      params: { page, limit, mock_error: params?.mock_error },
    });
    const parsedDto = PaginatedRfqsDtoSchema.parse(rawData);
    return mapPaginatedRfqsFromDto(parsedDto);
  },

  async get(id: string): Promise<RfqRequest> {
    const rawData = await httpClient<unknown>(`/rfqs/${id}`);
    const parsedDto = RfqDtoSchema.parse(rawData);
    return mapRfqFromDto(parsedDto);
  },

  async submit(input: CreateRfqInput): Promise<RfqRequest> {
    const payload = {
      company_name: input.companyName,
      contact_email: input.contactEmail,
      contact_phone: input.contactPhone,
      shipping_country: input.shippingCountry,
      request_type: input.requestType || 'quote',
      target_lead_time_days: input.targetLeadTimeDays,
      notes: input.notes,
      items: input.items.map((i) => ({
        product_id: i.productId,
        product_title: i.productTitle,
        variant_id: i.variantId,
        variant_sku: i.variantSku,
        quantity: i.quantity,
        target_unit_price: i.targetUnitPrice,
      })),
    };

    const rawData = await httpClient<unknown>('/rfqs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const parsedDto = RfqDtoSchema.parse(rawData);
    return mapRfqFromDto(parsedDto);
  },
};
