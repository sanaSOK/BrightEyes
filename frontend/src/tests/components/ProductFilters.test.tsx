import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/renderWithProviders';
import { ProductFilters } from '@/features/products/components/ProductFilters';

const mockCategories = [
  { id: 'cat-acetate', slug: 'acetate', name: 'Acetate Frames', description: '', productCount: 12 },
  { id: 'cat-titanium', slug: 'titanium', name: 'Titanium Frames', description: '', productCount: 10 },
];

const mockAttributes = [
  { key: 'frame_material', label: 'Frame Material', type: 'select' as const, options: ['Italian Acetate', 'Titanium'] },
];

describe('ProductFilters Component', () => {
  it('renders categories and dynamic attribute filters dynamically', () => {
    renderWithProviders(
      <ProductFilters
        categories={mockCategories}
        availableAttributes={mockAttributes}
        filters={{}}
        onChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByText('Acetate Frames')).toBeInTheDocument();
    expect(screen.getByText('Titanium Frames')).toBeInTheDocument();
    expect(screen.getByText('Frame Material')).toBeInTheDocument();
    expect(screen.getByText('Italian Acetate')).toBeInTheDocument();
  });

  it('triggers onChange callback when category is selected', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <ProductFilters
        categories={mockCategories}
        availableAttributes={mockAttributes}
        filters={{}}
        onChange={handleChange}
        onReset={vi.fn()}
      />
    );

    await user.click(screen.getByText('Acetate Frames'));

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ categoryId: 'cat-acetate', page: 1 })
    );
  });
});
