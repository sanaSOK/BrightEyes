import { Product } from '@/features/products';

export function calculateUnitPrice(product: Product, quantity: number): number {
  if (!product.priceTiers || product.priceTiers.length === 0) {
    return 0;
  }

  // Find tier matching quantity
  const sortedTiers = [...product.priceTiers].sort((a, b) => b.minQuantity - a.minQuantity);
  const matchedTier = sortedTiers.find((tier) => quantity >= tier.minQuantity);

  if (matchedTier) {
    return matchedTier.unitPrice;
  }

  // Default to lowest quantity tier
  const lowestMinTier = [...product.priceTiers].sort((a, b) => a.minQuantity - b.minQuantity)[0];
  return lowestMinTier ? lowestMinTier.unitPrice : 0;
}

export function calculateCartItemSubtotal(product: Product, quantity: number) {
  const unitPrice = calculateUnitPrice(product, quantity);
  const subtotal = unitPrice * quantity;
  return { unitPrice, subtotal };
}
