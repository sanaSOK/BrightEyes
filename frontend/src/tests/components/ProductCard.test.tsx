import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/renderWithProviders';
import { ProductCard } from '@/features/products/components/ProductCard';
import { Product } from '@/features/products/types';

const mockProduct: Product = {
  id: 'prod-001',
  slug: 'test-acetate-frame',
  title: 'Mazzucchelli Vintage Square Acetate Frame',
  description: 'Handcrafted acetate optical frame.',
  categoryId: 'cat-acetate-frames',
  categoryName: 'Acetate Eyeglass Frames',
  images: ['https://example.com/frame.jpg'],
  supplier: {
    id: 'sup-1',
    name: 'Milano Acetate Labs',
    verified: true,
    countryOfOrigin: 'Italy',
    leadTimeDays: 14,
  },
  moq: 50,
  quantityStep: 10,
  priceTiers: [
    { minQuantity: 50, maxQuantity: 199, unitPrice: 24.5 },
    { minQuantity: 200, unitPrice: 19.8 },
  ],
  compareAtPrice: 32.0,
  discountPercent: 23,
  badges: ['Choice', 'Verified'],
  shippingHighlight: { text: 'Free Air Express' },
  rating: 4.9,
  soldCount: 3200,
  dealProgress: { claimedPercent: 75, unitsLeft: 600 },
  variants: [
    { id: 'v1', sku: 'AC801-BLK', name: 'Black', stock: 500 },
  ],
  attributes: { frame_material: 'Italian Acetate' },
  priceVisibility: 'public',
  totalStock: 500,
  createdAt: '2026-01-01T00:00:00Z',
};

describe('ProductCard Component', () => {
  it('renders product title, category, supplier and MOQ in grid variant', () => {
    renderWithProviders(<ProductCard product={mockProduct} variant="grid" />);

    expect(screen.getByText('Mazzucchelli Vintage Square Acetate Frame')).toBeInTheDocument();
    expect(screen.getByText('Acetate Eyeglass Frames')).toBeInTheDocument();
    expect(screen.getByText('Milano Acetate Labs')).toBeInTheDocument();
    expect(screen.getByText(/MOQ: 50 pcs/i)).toBeInTheDocument();
  });

  it('renders deal variant with claimed progress and units left', () => {
    renderWithProviders(<ProductCard product={mockProduct} variant="deal" />);

    expect(screen.getByText(/Hot Deal/i)).toBeInTheDocument();
    expect(screen.getByText(/Claimed 75%/i)).toBeInTheDocument();
    expect(screen.getByText(/600 pcs left/i)).toBeInTheDocument();
  });

  it('triggers onAddToCart callback emitting (product, product.moq) when clicked', async () => {
    const handleAddToCart = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <ProductCard product={mockProduct} variant="grid" onAddToCart={handleAddToCart} />
    );

    const btn = screen.getByTitle(/Add 50 pcs/i);
    await user.click(btn);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct, 50);
  });

  it('shows restricted price notice when user is not approved for approved_only products', () => {
    const restrictedProduct: Product = {
      ...mockProduct,
      priceVisibility: 'approved_only',
    };

    renderWithProviders(
      <ProductCard product={restrictedProduct} variant="grid" userApproved={false} />
    );

    expect(screen.getByText(/Login to see price/i)).toBeInTheDocument();
  });
});
