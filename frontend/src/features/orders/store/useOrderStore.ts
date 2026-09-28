import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '../types';

interface OrderState {
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: 'ord-8801',
          orderNumber: 'ORD-2026-9901',
          companyName: 'OptiVision Wholesale Ltd.',
          items: [
            {
              productId: 'prod-001',
              productTitle: 'Mazzucchelli Vintage Square Acetate Frame AC-801',
              variantSku: 'AC801-BLK-52',
              quantity: 200,
              unitPrice: 19.80,
              subtotal: 3960.00,
            },
            {
              productId: 'prod-037',
              productTitle: 'German OBE 5-Barrel Precision Spring Hinges (100 Pairs)',
              variantSku: 'CMP-OBE-5B-100',
              quantity: 500,
              unitPrice: 1.35,
              subtotal: 675.00,
            },
          ],
          totalAmount: 4635.00,
          shippingAddress: '840 Optics Boulevard, Suite 400, Los Angeles, CA 90015, USA',
          status: 'shipped',
          trackingNumber: 'DHL-EXPRESS-992019281',
          createdAt: '2026-03-15T14:30:00Z',
        },
      ],

      createOrder: (newOrderInput) => {
        const id = `ord-${Date.now()}`;
        const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        const newOrder: Order = {
          ...newOrderInput,
          id,
          orderNumber,
          createdAt: new Date().toISOString(),
        };

        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },

      getOrderById: (id: string) => get().orders.find((o) => o.id === id),
    }),
    {
      name: 'b2b_optics_orders_storage',
    }
  )
);
