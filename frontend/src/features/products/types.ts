export type PriceVisibility = 'public' | 'approved_only';

export interface PriceTier {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  color?: string;
  size?: string;
  lensType?: string;
  stock: number;
  priceOffset?: number;
  imageUrl?: string;
}

export interface Supplier {
  id: string;
  name: string;
  verified: boolean;
  countryOfOrigin: string;
  leadTimeDays: number;
  logoUrl?: string;
}

export interface ShippingHighlight {
  icon?: string;
  text: string;
}

export interface DealProgress {
  claimedPercent: number;
  unitsLeft: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  supplier: Supplier;
  moq: number;
  quantityStep: number;
  priceTiers: PriceTier[];
  variants: ProductVariant[];
  attributes: Record<string, string | number | string[]>;
  priceVisibility: PriceVisibility;
  totalStock: number;
  rating?: number;
  ratingCount?: number;
  soldCount?: number;
  compareAtPrice?: number;
  discountPercent?: number;
  badges?: string[];
  shippingHighlight?: ShippingHighlight;
  dealProgress?: DealProgress;
  createdAt: string;
}

export interface AttributeDefinition {
  key: string;
  label: string;
  type: 'select' | 'range' | 'multi-select';
  options: (string | number)[];
}

export type ProductSortOption = 'popularity' | 'orders' | 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'moq_asc';

export interface ProductFilterParams {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: ProductSortOption;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  attributes?: Record<string, string | string[]>;
}

export interface PaginatedProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  availableAttributes: AttributeDefinition[];
}
