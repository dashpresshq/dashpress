import React, { ReactNode } from "react";
import { QueryClientProvider, QueryClient, QueryCache } from "react-query";

export const queryCache = new QueryCache();

const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        const statusCode = (error as Response)?.status;
        if (!statusCode) {
          return true;
        }
        if (`${statusCode}`.startsWith("4")) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
