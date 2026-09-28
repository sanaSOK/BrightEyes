import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No products found',
  description = 'Try adjusting your filters or search keywords to find optics inventory.',
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center my-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 mb-4">
        {icon || <PackageOpen className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="mt-6 border-cyan-800/40 text-cyan-300">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
