import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actionSlot?: React.ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  title,
  description,
  actionSlot,
  className,
}: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 py-6 md:py-8', className)}>
      {(title || description || actionSlot) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            {title && <h1 className="text-2xl font-bold tracking-tight text-slate-100">{title}</h1>}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          {actionSlot && <div>{actionSlot}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
