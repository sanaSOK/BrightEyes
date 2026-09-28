'use client';

import React from 'react';
import Link from 'next/link';
import { useOrderStore } from '@/features/orders';
import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/formatters';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';

export default function OrdersPage() {
  const { orders } = useOrderStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="warning"><Clock className="mr-1 h-3 w-3" /> Processing</Badge>;
      case 'shipped':
        return <Badge variant="default"><Truck className="mr-1 h-3 w-3" /> Shipped</Badge>;
      case 'delivered':
        return <Badge variant="success"><CheckCircle2 className="mr-1 h-3 w-3" /> Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <PageContainer
      title="Wholesale Order History"
      description="Track purchase orders, shipment tracking numbers, and factory fulfillment status."
    >
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
            <Package className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-base font-semibold text-slate-200">No Orders Placed Yet</h3>
            <p className="mt-1 text-xs text-slate-400">
              Your wholesale purchases will appear here after checkout.
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 transition-all hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <span className="text-xs text-slate-400">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs text-slate-300 py-1 border-b border-slate-950/40 last:border-0"
                  >
                    <span className="truncate max-w-[280px]">
                      {item.productTitle} ({item.variantSku})
                    </span>
                    <span className="font-semibold text-slate-100">
                      {item.quantity} pcs × {formatCurrency(item.unitPrice)} = {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div className="text-slate-400">
                  {order.trackingNumber && (
                    <span className="font-mono font-medium text-emerald-400">
                      Tracking: {order.trackingNumber}
                    </span>
                  )}
                </div>
                <div className="text-right mt-1 sm:mt-0">
                  <span className="text-slate-400 mr-2">Total Amount:</span>
                  <span className="text-base font-bold text-cyan-400">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageContainer>
  );
}
