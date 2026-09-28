import { RfqRequest, RfqItem, PaginatedRfqsResponse } from '../types';
import { RfqDto, RfqItemDto, PaginatedRfqsDto } from '../schemas/rfqSchema';

export function mapRfqItemFromDto(dto: RfqItemDto): RfqItem {
  return {
    productId: dto.product_id,
    productTitle: dto.product_title,
    variantId: dto.variant_id,
    variantSku: dto.variant_sku,
    quantity: dto.quantity,
    targetUnitPrice: dto.target_unit_price,
  };
}

export function mapRfqFromDto(dto: RfqDto): RfqRequest {
  return {
    id: dto.id,
    referenceNo: dto.reference_no,
    companyName: dto.company_name,
    contactEmail: dto.contact_email,
    contactPhone: dto.contact_phone,
    shippingCountry: dto.shipping_country,
    requestType: dto.request_type || 'quote',
    items: dto.items.map(mapRfqItemFromDto),
    targetLeadTimeDays: dto.target_lead_time_days,
    notes: dto.notes,
    status: dto.status,
    createdAt: dto.created_at,
  };
}

export function mapPaginatedRfqsFromDto(dto: PaginatedRfqsDto): PaginatedRfqsResponse {
  return {
    items: dto.items.map(mapRfqFromDto),
    total: dto.total,
    page: dto.page,
    limit: dto.limit,
    totalPages: dto.total_pages,
  };
}
