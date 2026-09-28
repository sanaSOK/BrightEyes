import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';
import { Product, ProductVariant } from '@/features/products';
import { calculateCartItemSubtotal } from '../utils/pricing';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalQuantity: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, variant: ProductVariant, initialQty: number) => {
        const itemId = `${product.id}_${variant.id}`;
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === itemId);

        const moq = product.moq || 1;
        const step = product.quantityStep || 1;

        let finalQty = existingItem ? existingItem.quantity + initialQty : Math.max(initialQty, moq);

        // Normalize step increment
        if (step > 1) {
          const remainder = (finalQty - moq) % step;
          if (remainder !== 0) {
            finalQty = finalQty + (step - remainder);
          }
        }

        const { unitPrice, subtotal } = calculateCartItemSubtotal(product, finalQty);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === itemId
                ? { ...item, quantity: finalQty, unitPrice, subtotal }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: itemId,
                product,
                variant,
                quantity: finalQty,
                unitPrice,
                subtotal,
              },
            ],
          });
        }
      },

      updateQuantity: (itemId: string, newQty: number) => {
        const currentItems = get().items;
        const targetItem = currentItems.find((i) => i.id === itemId);
        if (!targetItem) return;

        const moq = targetItem.product.moq || 1;
        const normalizedQty = Math.max(newQty, moq);

        const { unitPrice, subtotal } = calculateCartItemSubtotal(
          targetItem.product,
          normalizedQty
        );

        set({
          items: currentItems.map((item) =>
            item.id === itemId
              ? { ...item, quantity: normalizedQty, unitPrice, subtotal }
              : item
          ),
        });
      },

      removeItem: (itemId: string) => {
        set({
          items: get().items.filter((i) => i.id !== itemId),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => get().items.length,

      getTotalQuantity: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalAmount: () =>
        get().items.reduce((sum, item) => sum + item.subtotal, 0),
    }),
    {
      name: 'b2b_optics_cart_storage',
    }
  )
);
