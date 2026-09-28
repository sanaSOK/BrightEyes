'use client';

import React from 'react';
import { ProductVariant } from '../types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

export interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onSelectVariant: (variant: ProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelectVariant,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Select SKU Variant
        </label>
        <span className="text-xs text-slate-400">
          {variants.length} SKU options available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {variants.map((v) => {
          const isSelected = v.id === selectedVariantId;
          const isOutOfStock = v.stock <= 0;

          return (
            <button
              key={v.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(v)}
              className={cn(
                'flex items-center justify-between rounded-xl border p-3 text-left transition-all',
                isSelected
                  ? 'border-cyan-500 bg-cyan-950/30 text-slate-100 ring-1 ring-cyan-500/40'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900',
                isOutOfStock && 'opacity-40 cursor-not-allowed'
              )}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-100">{v.name}</span>
                </div>
                <div className="mt-0.5 flex items-center space-x-2 text-[11px] text-slate-400">
                  <span>SKU: {v.sku}</span>
                  {v.size && <span>• Size: {v.size}</span>}
                </div>
              </div>

              <div className="text-right">
                {isOutOfStock ? (
                  <Badge variant="destructive" className="text-[10px]">Out</Badge>
                ) : (
                  <span className="text-xs font-medium text-emerald-400">{v.stock} pcs</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
