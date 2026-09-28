'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/features/cart';
import { useOrderStore } from '@/features/orders';
import { useAuthStore } from '@/features/auth';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils/formatters';
import { CheckCircle2, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalAmount, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();

  const [address, setAddress] = useState(
    user?.company.address || '840 Optics Boulevard, Suite 400, Los Angeles, CA 90015'
  );
  const [paymentTerms, setPaymentTerms] = useState('net30');
  const [completedOrderNo, setCompletedOrderNo] = useState<string | null>(null);

  if (completedOrderNo) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-cyan-950/20 border border-cyan-800/40 my-8">
          <CheckCircle2 className="h-14 w-14 text-cyan-400 mb-3" />
          <h2 className="text-2xl font-bold text-slate-100">Wholesale Order Confirmed!</h2>
          <p className="mt-1 text-sm text-slate-300">
            Order Reference Number:{' '}
            <span className="font-mono font-bold text-cyan-300">{completedOrderNo}</span>
          </p>
          <p className="mt-2 text-xs text-slate-400 max-w-md">
            Your wholesale purchase order has been transmitted to supplier factories. You can track shipping status in your Order History.
          </p>
          <div className="flex space-x-3 mt-6">
            <Button
              onClick={() => router.push('/orders')}
              className="bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold"
            >
              View Order History
            </Button>
            <Button
              onClick={() => router.push('/products')}
              variant="outline"
              className="border-slate-800 text-slate-300 text-xs"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    const totalAmount = getTotalAmount();

    const orderItems = items.map((i) => ({
      productId: i.product.id,
      productTitle: i.product.title,
      productImage: i.product.images[0],
      variantSku: i.variant.sku,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      subtotal: i.subtotal,
    }));

    const created = createOrder({
      companyName: user?.company.name || 'OptiVision Wholesale Ltd.',
      items: orderItems,
      totalAmount,
      shippingAddress: address,
      status: 'processing',
    });

    clearCart();
    setCompletedOrderNo(created.orderNumber);
  };

  return (
    <PageContainer
      title="B2B Wholesale Checkout"
      description="Finalize delivery address, select corporate payment terms, and place order."
    >
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Company & Delivery Info */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center">
              <Truck className="mr-2 h-4 w-4 text-cyan-400" />
              1. Delivery & Cargo Address
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Company Name</label>
              <Input
                readOnly
                value={user?.company.name || 'OptiVision Wholesale Ltd.'}
                className="bg-slate-950 border-slate-800 text-xs text-slate-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Wholesale Shipping Destination
              </label>
              <Input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-slate-900 border-slate-800 text-xs text-slate-100"
              />
            </div>
          </div>

          {/* Payment Terms */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-cyan-400" />
              2. Corporate Payment Terms
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start space-x-3 rounded-xl border p-4 cursor-pointer transition-all ${
                  paymentTerms === 'net30'
                    ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950/40'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="net30"
                  checked={paymentTerms === 'net30'}
                  onChange={() => setPaymentTerms('net30')}
                  className="mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-slate-100 block">NET 30 Credit Terms</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Invoice payable within 30 days of shipment receipt.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start space-x-3 rounded-xl border p-4 cursor-pointer transition-all ${
                  paymentTerms === 'lc'
                    ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950/40'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="lc"
                  checked={paymentTerms === 'lc'}
                  onChange={() => setPaymentTerms('lc')}
                  className="mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-slate-100 block">Letter of Credit (L/C)</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Irrevocable LC at sight via partner bank.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3">
              Summary
            </h3>

            <div className="space-y-2 text-xs">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-slate-300">
                  <span className="truncate max-w-[180px]">{i.product.title} ({i.quantity} pcs)</span>
                  <span className="font-semibold text-cyan-400">{formatCurrency(i.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-100">Total</span>
              <span className="text-xl font-bold text-cyan-400">
                {formatCurrency(getTotalAmount())}
              </span>
            </div>

            <Button type="submit" size="lg" className="w-full bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold">
              Confirm Purchase Order
            </Button>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}
