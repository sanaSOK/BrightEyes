import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { Product, ProductVariant } from '@/features/products/types';

const testProduct: Product = {
  id: 'prod-cart-1',
  slug: 'test-acetate-cart',
  title: 'Test Wholesale Acetate Frame',
  description: 'High end acetate frame',
  categoryId: 'cat-acetate-frames',
  categoryName: 'Acetate Eyeglass Frames',
  images: ['https://example.com/img.jpg'],
  supplier: { id: 'sup-1', name: 'Milano Labs', verified: true, countryOfOrigin: 'Italy', leadTimeDays: 14 },
  moq: 50,
  quantityStep: 10,
  priceTiers: [
    { minQuantity: 50, maxQuantity: 199, unitPrice: 24.50 },
    { minQuantity: 200, unitPrice: 19.80 },
  ],
  variants: [
    { id: 'var-blk', sku: 'AC-BLK-52', name: 'Black', stock: 1000 },
  ],
  attributes: {},
  priceVisibility: 'public',
  totalStock: 1000,
  createdAt: '2026-01-01T00:00:00Z',
};

const testVariant: ProductVariant = testProduct.variants[0];

describe('Cart Store & Tier Pricing Engine', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds item to cart with quantity defaulting to product MOQ', () => {
    const store = useCartStore.getState();
    store.addItem(testProduct, testVariant, testProduct.moq);

    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(50);
    expect(items[0].unitPrice).toBe(24.50);
    expect(items[0].subtotal).toBe(50 * 24.50);
  });

  it('recalculates tier price when quantity crosses tier boundary (50 -> 200 pcs)', () => {
    const store = useCartStore.getState();
    store.addItem(testProduct, testVariant, 50);

    let items = useCartStore.getState().items;
    expect(items[0].unitPrice).toBe(24.50);

    // Update quantity to 200 (tier 2 threshold)
    store.updateQuantity(items[0].id, 200);

    items = useCartStore.getState().items;
    expect(items[0].quantity).toBe(200);
    expect(items[0].unitPrice).toBe(19.80);
    expect(items[0].subtotal).toBe(200 * 19.80);
  });

  it('enforces MOQ when attempting to set quantity below MOQ', () => {
    const store = useCartStore.getState();
    store.addItem(testProduct, testVariant, 50);

    let items = useCartStore.getState().items;

    // Try setting quantity to 10 (below MOQ of 50)
    store.updateQuantity(items[0].id, 10);

    items = useCartStore.getState().items;
    expect(items[0].quantity).toBe(50);
  });

  it('correctly calculates total quantity and subtotal amount across multiple items', () => {
    const store = useCartStore.getState();
    store.addItem(testProduct, testVariant, 100);

    expect(useCartStore.getState().getTotalQuantity()).toBe(100);
    expect(useCartStore.getState().getTotalAmount()).toBe(100 * 24.50);

    store.removeItem(`${testProduct.id}_${testVariant.id}`);
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
