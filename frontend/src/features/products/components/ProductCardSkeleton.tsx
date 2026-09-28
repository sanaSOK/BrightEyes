import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';

export interface ProductCardSkeletonProps {
  variant?: 'grid' | 'list' | 'compact';
  className?: string;
}

export function ProductCardSkeleton({
  variant = 'grid',
  className,
}: ProductCardSkeletonProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3', className)}>
        <Skeleton className="h-14 w-14 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('flex flex-col sm:flex-row gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4', className)}>
        <Skeleton className="h-44 sm:h-36 w-full sm:w-48 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <div className="flex space-x-2 pt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3', className)}>
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-1/2" />
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}
