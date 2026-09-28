import { Product, PaginatedProductsResponse, PriceTier, ProductVariant, Supplier } from '../types';
import { ProductDto, PaginatedProductsDto, PriceTierDto, VariantDto, SupplierDto } from '../schemas/productSchema';

export function mapPriceTierFromDto(dto: PriceTierDto): PriceTier {
  return {
    minQuantity: dto.min_quantity,
    maxQuantity: dto.max_quantity,
    unitPrice: dto.unit_price,
  };
}

export function mapVariantFromDto(dto: VariantDto): ProductVariant {
  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    color: dto.color,
    size: dto.size,
    lensType: dto.lens_type,
    stock: dto.stock,
    priceOffset: dto.price_offset,
    imageUrl: dto.image_url,
  };
}

export function mapSupplierFromDto(dto: SupplierDto): Supplier {
  return {
    id: dto.id,
    name: dto.name,
    verified: dto.verified,
    countryOfOrigin: dto.country_of_origin,
    leadTimeDays: dto.lead_time_days,
    logoUrl: dto.logo_url,
  };
}

export function mapProductFromDto(dto: ProductDto): Product {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    description: dto.description,
    categoryId: dto.category_id,
    categoryName: dto.category_name,
    images: dto.images,
    supplier: mapSupplierFromDto(dto.supplier),
    moq: dto.moq,
    quantityStep: dto.quantity_step,
    priceTiers: dto.price_tiers.map(mapPriceTierFromDto),
    variants: dto.variants.map(mapVariantFromDto),
    attributes: dto.attributes,
    priceVisibility: dto.price_visibility,
    totalStock: dto.total_stock,
    rating: dto.rating,
    ratingCount: dto.rating_count,
    soldCount: dto.sold_count,
    compareAtPrice: dto.compare_at_price,
    discountPercent: dto.discount_percent,
    badges: dto.badges,
    shippingHighlight: dto.shipping_highlight ? {
      icon: dto.shipping_highlight.icon,
      text: dto.shipping_highlight.text,
    } : undefined,
    dealProgress: dto.deal_progress ? {
      claimedPercent: dto.deal_progress.claimed_percent,
      unitsLeft: dto.deal_progress.units_left,
    } : undefined,
    createdAt: dto.created_at,
  };
}

export function mapPaginatedProductsFromDto(dto: PaginatedProductsDto): PaginatedProductsResponse {
  return {
    items: dto.items.map(mapProductFromDto),
    total: dto.total,
    page: dto.page,
    limit: dto.limit,
    totalPages: dto.total_pages,
    availableAttributes: dto.available_attributes.map((attr) => ({
      key: attr.key,
      label: attr.label,
      type: attr.type,
      options: attr.options,
    })),
  };
}
