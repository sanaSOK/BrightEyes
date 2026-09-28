// Public API of Products feature
export * from './types';
export * from './schemas/productSchema';
export * from './mappers/productMapper';
export * from './services/productService';
export * from './hooks/useProducts';

// Components
export { ProductCard } from './components/ProductCard';
export type { ProductCardProps } from './components/ProductCard';

export { ProductCardSkeleton } from './components/ProductCardSkeleton';
export type { ProductCardSkeletonProps } from './components/ProductCardSkeleton';

export { ProductGrid } from './components/ProductGrid';
export type { ProductGridProps } from './components/ProductGrid';

export { ProductFilters } from './components/ProductFilters';
export type { ProductFiltersProps } from './components/ProductFilters';

export { ProductGallery } from './components/ProductGallery';
export type { ProductGalleryProps } from './components/ProductGallery';

export { VariantSelector } from './components/VariantSelector';
export type { VariantSelectorProps } from './components/VariantSelector';

export { TierPriceTable } from './components/TierPriceTable';
export type { TierPriceTableProps } from './components/TierPriceTable';
