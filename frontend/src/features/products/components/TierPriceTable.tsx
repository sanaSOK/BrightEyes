'use client';

import React from 'react';
import { PriceTier } from '../types';
import { formatCurrency } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

export interface TierPriceTableProps {
  priceTiers: PriceTier[];
  quantity?: number;
  className?: string;
}

export function TierPriceTable({
  priceTiers,
  quantity,
  className,
}: TierPriceTableProps) {
  if (!priceTiers || priceTiers.length === 0) return null;

  const sortedTiers = [...priceTiers].sort((a, b) => a.minQuantity - b.minQuantity);

  return (
    <div className={cn('rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Wholesale Volume Tier Pricing
        </h4>
        <span className="text-[11px] text-cyan-400 font-medium">Bulk Discounts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {sortedTiers.map((tier, idx) => {
          const isCurrentActive =
            quantity !== undefined &&
            quantity >= tier.minQuantity &&
            (tier.maxQuantity === undefined || quantity <= tier.maxQuantity);

          const rangeText = tier.maxQuantity
            ? `${tier.minQuantity} - ${tier.maxQuantity} pcs`
            : `${tier.minQuantity}+ pcs`;

          return (
            <div
              key={idx}
              className={cn(
                'relative flex flex-col justify-between rounded-xl border p-3 transition-all',
                isCurrentActive
                  ? 'border-cyan-500 bg-cyan-950/40 text-slate-100 ring-2 ring-cyan-500/30'
                  : 'border-slate-800 bg-slate-950/40 text-slate-300'
              )}
            >
              {isCurrentActive && (
                <span className="absolute -top-2 right-2 flex items-center bg-cyan-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <Check className="mr-0.5 h-2.5 w-2.5" /> Active
                </span>
              )}
              <span className="text-xs font-semibold text-slate-400">{rangeText}</span>
              <span className="mt-1 text-lg font-bold text-cyan-400">
                {formatCurrency(tier.unitPrice)}
                <span className="text-xs text-slate-400 font-normal"> / pc</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
