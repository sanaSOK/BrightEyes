import { describe, it, expect } from 'vitest';
import { calculateUnitPrice } from '@/features/cart/utils/pricing';
import { formatQuantityStep } from '@/lib/utils/formatters';
import { Product } from '@/features/products';

const sampleProduct: Product = {
  id: 'prod-test',
  slug: 'test-product',
  title: 'Test Acetate Frame',
  description: 'Test description',
  categoryId: 'cat-acetate',
  categoryName: 'Acetate Frames',
  images: [],
  supplier: { id: 's1', name: 'Test Factory', verified: true, countryOfOrigin: 'Italy', leadTimeDays: 10 },
  moq: 50,
  quantityStep: 10,
  priceTiers: [
    { minQuantity: 50, maxQuantity: 199, unitPrice: 20.0 },
    { minQuantity: 200, maxQuantity: 499, unitPrice: 15.0 },
    { minQuantity: 500, unitPrice: 10.0 },
  ],
  variants: [],
  attributes: {},
  priceVisibility: 'public',
  totalStock: 1000,
  createdAt: '2026-01-01T00:00:00Z',
};

describe('Tier Pricing Calculation Engine', () => {
  it('correctly calculates tier 1 unit price for quantity within 50 - 199', () => {
    const price = calculateUnitPrice(sampleProduct, 100);
    expect(price).toBe(20.0);
  });

  it('correctly calculates tier 2 unit price for quantity within 200 - 499', () => {
    const price = calculateUnitPrice(sampleProduct, 250);
    expect(price).toBe(15.0);
  });

  it('correctly calculates top volume tier for quantity >= 500', () => {
    const price = calculateUnitPrice(sampleProduct, 1000);
    expect(price).toBe(10.0);
  });

  it('defaults to lowest tier if quantity is below MOQ', () => {
    const price = calculateUnitPrice(sampleProduct, 10);
    expect(price).toBe(20.0);
  });
});

describe('MOQ & Step Quantity Normalization', () => {
  it('rounds quantity up to nearest step multiple', () => {
    expect(formatQuantityStep(53, 10)).toBe(60);
    expect(formatQuantityStep(50, 10)).toBe(50);
    expect(formatQuantityStep(1, 20)).toBe(20);
  });
});
