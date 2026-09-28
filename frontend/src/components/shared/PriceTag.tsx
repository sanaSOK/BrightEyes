'use client';

import React from 'react';
import { Product } from '@/features/products/types';
import { formatCurrency } from '@/lib/utils/formatters';
import { Lock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PriceTagProps {
  product: Product;
  quantity?: number;
  userApproved?: boolean;
  onRequestQuote?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({
  product,
  quantity,
  userApproved = true,
  onRequestQuote,
  size = 'md',
}: PriceTagProps) {
  // If price is restricted to approved accounts and user is not approved
  if (product.priceVisibility === 'approved_only' && !userApproved) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center space-x-1.5 text-amber-400 font-medium text-xs bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 w-fit">
          <Lock className="h-3.5 w-3.5" />
          <span>Login to see price</span>
        </div>
        {onRequestQuote && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRequestQuote}
            className="h-7 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            <FileText className="mr-1 h-3 w-3" />
            Request Quote
          </Button>
        )}
      </div>
    );
  }

  const { priceTiers, compareAtPrice } = product;
  if (!priceTiers || priceTiers.length === 0) {
    return <span className="text-slate-400 text-xs">Request Quote</span>;
  }

  const prices = priceTiers.map((t) => t.unitPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // If a specific quantity is provided, lookup tier price
  let currentUnitPrice: number | null = null;
  if (quantity && quantity >= product.moq) {
    const matchedTier = [...priceTiers]
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find((t) => quantity >= t.minQuantity);
    if (matchedTier) {
      currentUnitPrice = matchedTier.unitPrice;
    }
  }

  const textSize =
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  if (currentUnitPrice !== null) {
    return (
      <div className="flex flex-col">
        <div className="flex items-baseline space-x-2 flex-wrap">
          <span className={`font-bold text-cyan-400 ${textSize}`}>
            {formatCurrency(currentUnitPrice)}
          </span>
          {compareAtPrice && compareAtPrice > currentUnitPrice && (
            <span className="text-xs text-slate-500 line-through">
              {formatCurrency(compareAtPrice)}
            </span>
          )}
          <span className="text-xs text-slate-400">/ pc</span>
        </div>
        <span className="text-[11px] text-emerald-400 font-medium">
          Tier rate applied ({quantity} pcs)
        </span>
      </div>
    );
  }

  // General display (no quantity specified)
  const isRange = minPrice !== maxPrice;

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline space-x-2 flex-wrap">
        {isRange ? (
          <div className="flex items-baseline space-x-1">
            <span className="text-xs text-slate-400 font-normal">From </span>
            <span className={`font-bold text-cyan-400 ${textSize}`}>
              {formatCurrency(minPrice)}
            </span>
          </div>
        ) : (
          <span className={`font-bold text-cyan-400 ${textSize}`}>
            {formatCurrency(minPrice)}
          </span>
        )}

        {compareAtPrice && compareAtPrice > minPrice && (
          <span className="text-xs text-slate-500 line-through">
            {formatCurrency(compareAtPrice)}
          </span>
        )}

        <span className="text-xs text-slate-400">/ pc</span>
      </div>
      <span className="text-[11px] text-slate-400">
        MOQ: {product.moq} pcs
      </span>
    </div>
  );
}
