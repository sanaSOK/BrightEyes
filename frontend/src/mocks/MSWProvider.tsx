'use client';

import React, { useEffect, useState } from 'react';
import { env } from '@/lib/config/env';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(!env.NEXT_PUBLIC_USE_MOCKS);

  useEffect(() => {
    if (env.NEXT_PUBLIC_USE_MOCKS && typeof window !== 'undefined') {
      import('./browser').then(({ worker }) => {
        worker
          .start({
            onUnhandledRequest: 'bypass',
          })
          .then(() => {
            setMswReady(true);
          })
          .catch((err) => {
            console.error('Failed to start MSW worker:', err);
            setMswReady(true);
          });
      });
    }
  }, []);

  if (!mswReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex items-center space-x-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
          <span className="text-sm font-medium">Initializing OptiTrade B2B Network Interceptor...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
