import { Product, ProductVariant } from '@/features/products';

export interface CartItem {
  id: string; // unique key e.g. `${product.id}_${variant.id}`
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
