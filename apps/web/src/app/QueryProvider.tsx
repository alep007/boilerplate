// apps/web/app/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inicializamos el cliente una sola vez por sesión de usuario
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Un staleTime superior a 0 es crucial para evitar refetches agresivos
            // en componentes con mucha carga dinámica o scrollables.
            staleTime: 60 * 1000, // 1 minuto por defecto
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools accesibles en desarrollo mediante un botón flotante */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
