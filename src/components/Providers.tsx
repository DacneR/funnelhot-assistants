'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Inicializamos el cliente de React Query una sola vez
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configuramos para que no re-haga fetch cada vez que cambias de ventana (opcional pero recomendado)
        refetchOnWindowFocus: false, 
        staleTime: 1000 * 60, // 1 minuto de cache
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* El Toaster es para las notificaciones bonitas */}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}