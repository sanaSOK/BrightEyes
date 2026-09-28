import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An error occurred while communicating with the optics marketplace server.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-900/30 bg-rose-950/10 p-12 text-center my-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-900/30 text-rose-400 border border-rose-700/40 mb-4">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-rose-200">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-400">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-6 border-rose-800/40 text-rose-300 hover:bg-rose-950/40">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
