'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/features/cart';
import { PageContainer } from '@/components/layout/PageContainer';
import { QuantityInput } from '@/components/shared/QuantityInput';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatCurrency } from '@/lib/utils/formatters';
import { Trash2, ShoppingCart, ArrowRight, Glasses, ShieldCheck, FileText } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotalAmount, getTotalQuantity } =
    useCartStore();

  if (items.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          title="Your B2B Cart is Empty"
          description="Browse our wholesale catalog of frames, high-index lenses, and optical components to build your order."
          actionLabel="Explore Optics Catalog"
          onAction={() => window.location.href = '/products'}
          icon={<ShoppingCart className="h-8 w-8" />}
        />
      </PageContainer>
    );
  }

  const totalAmount = getTotalAmount();
  const totalQuantity = getTotalQuantity();

  return (
    <PageContainer
      title="Wholesale Order Cart"
      description="Review items, adjust batch quantities matching MOQ constraints, and recalculate tier rates."
      actionSlot={
        <Button onClick={clearCart} variant="ghost" size="sm" className="text-slate-400 hover:text-rose-400">
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Clear Cart
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const primaryImage = item.product.images?.[0];

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-950 flex-shrink-0 border border-slate-800">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-600">
                        <Glasses className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.product.slug}`}>
                      <h4 className="text-xs font-bold text-slate-100 hover:text-cyan-400 transition-colors truncate">
                        {item.product.title}
                      </h4>
                    </Link>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span>SKU: {item.variant.sku}</span>
                      <span>•</span>
                      <span>{item.variant.name}</span>
                    </div>
                    <div className="mt-1 flex items-center text-[10px] text-slate-400">
                      <span>Supplier: {item.product.supplier.name}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="flex items-center space-x-4">
                  <QuantityInput
                    value={item.quantity}
                    onChange={(val) => updateQuantity(item.id, val)}
                    moq={item.product.moq}
                    step={item.product.quantityStep}
                    size="sm"
                  />

                  {/* Subtotal */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-xs font-bold text-cyan-400">
                      {formatCurrency(item.subtotal)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {formatCurrency(item.unitPrice)} / pc
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Items</span>
                <span className="font-semibold text-slate-200">{items.length} SKUs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Quantity</span>
                <span className="font-semibold text-slate-200">{totalQuantity} pcs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Freight</span>
                <span className="font-semibold text-emerald-400">Calculated at Checkout</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-100">Subtotal Amount</span>
              <span className="text-xl font-bold text-cyan-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link href="/checkout" className="block w-full">
                <Button size="lg" className="w-full bg-cyan-600 hover:bg-cyan-500 font-semibold text-xs">
                  Proceed to B2B Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/rfq" className="block w-full">
                <Button variant="outline" size="lg" className="w-full border-slate-700 text-slate-200 text-xs">
                  <FileText className="mr-2 h-4 w-4 text-amber-400" />
                  Convert Cart to RFQ Batch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
