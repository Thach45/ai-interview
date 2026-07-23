'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors position="top-right" />
        {children}
      </QueryClientProvider>
    </HelmetProvider>
  );
}
