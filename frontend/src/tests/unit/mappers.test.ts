import { describe, it, expect } from 'vitest';
import { mapProductFromDto, mapPriceTierFromDto } from '@/features/products/mappers/productMapper';
import { ProductDto } from '@/features/products/schemas/productSchema';

describe('DTO to Domain Mappers', () => {
  it('maps snake_case ProductDto to camelCase Domain Product cleanly', () => {
    const dto: ProductDto = {
      id: 'prod-dto-1',
      slug: 'titanium-frame-dto',
      title: 'Titanium DTO Frame',
      description: 'Clean titanium description',
      category_id: 'cat-titanium',
      category_name: 'Titanium Frames',
      images: ['https://example.com/img1.jpg'],
      supplier: {
        id: 'sup-1',
        name: 'Japan Optic',
        verified: true,
        country_of_origin: 'Japan',
        lead_time_days: 14,
      },
      moq: 30,
      quantity_step: 10,
      price_tiers: [
        { min_quantity: 30, max_quantity: 99, unit_price: 35.0 },
      ],
      variants: [
        {
          id: 'v1',
          sku: 'SKU-001',
          name: 'Silver',
          stock: 100,
        },
      ],
      attributes: { bridge_size: 19 },
      price_visibility: 'approved_only',
      total_stock: 100,
      created_at: '2026-01-01T00:00:00Z',
    };

    const domain = mapProductFromDto(dto);

    expect(domain.id).toBe('prod-dto-1');
    expect(domain.categoryId).toBe('cat-titanium');
    expect(domain.categoryName).toBe('Titanium Frames');
    expect(domain.quantityStep).toBe(10);
    expect(domain.supplier.countryOfOrigin).toBe('Japan');
    expect(domain.priceVisibility).toBe('approved_only');
    expect(domain.priceTiers[0].unitPrice).toBe(35.0);
  });
});
