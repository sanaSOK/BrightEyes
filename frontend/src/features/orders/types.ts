export type OrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage?: string;
  variantSku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  companyName: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
}
