'use client';

import React from 'react';
import { AttributeDefinition, ProductFilterParams } from '../types';
import { Category } from '@/features/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ProductFiltersProps {
  categories?: Category[];
  availableAttributes?: AttributeDefinition[];
  filters: ProductFilterParams;
  onChange: (newFilters: ProductFilterParams) => void;
  onReset: () => void;
  className?: string;
}

export function ProductFilters({
  categories = [],
  availableAttributes = [],
  filters,
  onChange,
  onReset,
  className,
}: ProductFiltersProps) {
  const handleCategorySelect = (catId?: string) => {
    onChange({
      ...filters,
      categoryId: filters.categoryId === catId ? undefined : catId,
      page: 1,
    });
  };

  const handleInStockToggle = () => {
    onChange({
      ...filters,
      inStockOnly: !filters.inStockOnly,
      page: 1,
    });
  };

  const handlePriceChange = (min?: number, max?: number) => {
    onChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
      page: 1,
    });
  };

  const handleAttributeToggle = (attrKey: string, optionVal: string | number) => {
    const currentAttrObj = { ...filters.attributes };
    const currentVal = currentAttrObj[attrKey];
    let newVal: string[];

    const optionStr = String(optionVal);

    if (!currentVal) {
      newVal = [optionStr];
    } else if (Array.isArray(currentVal)) {
      newVal = currentVal.includes(optionStr)
        ? currentVal.filter((v) => v !== optionStr)
        : [...currentVal, optionStr];
    } else {
      newVal = currentVal === optionStr ? [] : [currentVal, optionStr];
    }

    if (newVal.length === 0) {
      delete currentAttrObj[attrKey];
    } else {
      currentAttrObj[attrKey] = newVal;
    }

    onChange({
      ...filters,
      attributes: currentAttrObj,
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    filters.categoryId ||
      filters.inStockOnly ||
      filters.minPrice ||
      filters.maxPrice ||
      (filters.attributes && Object.keys(filters.attributes).length > 0)
  );

  return (
    <aside className={cn('flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5', className)}>
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-2 text-slate-100 font-semibold text-sm">
          <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
          <span>Dynamic Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Category Section */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</h4>
          <div className="space-y-1">
            {categories.map((cat) => {
              const isSelected = filters.categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors text-left',
                    isSelected
                      ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  )}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {cat.productCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Availability Filter */}
      <div className="border-t border-slate-800/80 pt-4 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Availability</h4>
        <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={handleInStockToggle}
            className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-600 focus:ring-cyan-500"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Price Tier Range */}
      <div className="border-t border-slate-800/80 pt-4 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Price / Unit Range ($)</h4>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => handlePriceChange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
            className="h-8 text-xs bg-slate-900 border-slate-800"
          />
          <span className="text-slate-600">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => handlePriceChange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
            className="h-8 text-xs bg-slate-900 border-slate-800"
          />
        </div>
      </div>

      {/* Dynamically Generated Attribute Filters */}
      {availableAttributes.length > 0 && (
        <div className="border-t border-slate-800/80 pt-4 space-y-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Technical Attributes
          </h4>

          {availableAttributes.map((attr) => {
            const selectedOptions = filters.attributes?.[attr.key];
            const selectedArr = Array.isArray(selectedOptions)
              ? selectedOptions
              : selectedOptions
              ? [selectedOptions]
              : [];

            return (
              <div key={attr.key} className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">{attr.label}</span>
                <div className="flex flex-wrap gap-1.5">
                  {attr.options.map((opt) => {
                    const optStr = String(opt);
                    const isChecked = selectedArr.includes(optStr);

                    return (
                      <button
                        key={optStr}
                        onClick={() => handleAttributeToggle(attr.key, opt)}
                        className={cn(
                          'flex items-center space-x-1 rounded-md px-2.5 py-1 text-xs transition-all border',
                          isChecked
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium'
                            : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                        )}
                      >
                        {isChecked && <Check className="h-3 w-3 text-cyan-400" />}
                        <span>{optStr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
