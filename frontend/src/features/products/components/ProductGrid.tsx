'use client';

import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';

export interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  variant?: 'grid' | 'list' | 'deal';
  userApproved?: boolean;
  onAddToCart?: (product: Product, quantity: number) => void;
  onRequestQuote?: (product: Product) => void;
  onClearFilters?: () => void;
}

export function ProductGrid({
  products,
  isLoading,
  isError,
  onRetry,
  variant = 'grid',
  userApproved = true,
  onAddToCart,
  onRequestQuote,
  onClearFilters,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div
        className={
          variant === 'list'
            ? 'flex flex-col gap-4'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
        }
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} variant={variant === 'deal' ? 'grid' : variant} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No Optics Inventory Match"
        description="We couldn't find any products matching your active search terms or dynamic filters."
        actionLabel="Clear All Filters"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div
      className={
        variant === 'list'
          ? 'flex flex-col gap-4'
          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
      }
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
          userApproved={userApproved}
          onAddToCart={onAddToCart}
          onRequestQuote={onRequestQuote}
        />
      ))}
    </div>
  );
}
