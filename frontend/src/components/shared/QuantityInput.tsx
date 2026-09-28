'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface QuantityInputProps {
  value: number;
  onChange: (val: number) => void;
  moq: number;
  step?: number;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantityInput({
  value,
  onChange,
  moq,
  step = 1,
  disabled = false,
  size = 'md',
  className,
}: QuantityInputProps) {
  const handleDecrement = () => {
    const nextVal = value - step;
    if (nextVal >= moq) {
      onChange(nextVal);
    } else {
      onChange(moq);
    }
  };

  const handleIncrement = () => {
    onChange(value + step);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) return;
    onChange(parsed);
  };

  const handleBlur = () => {
    let normalized = Math.max(moq, value);
    if (step > 1) {
      const remainder = (normalized - moq) % step;
      if (remainder !== 0) {
        normalized = normalized + (step - remainder);
      }
    }
    onChange(normalized);
  };

  const btnPadding = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const inputHeight = size === 'sm' ? 'h-7 text-xs w-14' : 'h-9 text-sm w-16';

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 p-0.5 shadow-sm">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= moq}
          className={cn(
            'flex items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors',
            btnPadding
          )}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          min={moq}
          step={step}
          className={cn(
            'bg-transparent text-center font-semibold text-slate-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            inputHeight
          )}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled}
          className={cn(
            'flex items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors',
            btnPadding
          )}
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      {step > 1 && (
        <span className="text-[10px] text-slate-400">
          Step: +{step} pcs (MOQ {moq})
        </span>
      )}
    </div>
  );
}
