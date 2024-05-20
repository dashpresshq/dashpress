import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider } from "frontend/design-system/theme/Context";
import { LinguiProvider } from "translations/utils";
import { Messages } from "@lingui/core";
import { ConfirmAlert } from "frontend/design-system/components/ConfirmAlert";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

export const queryCache = new QueryCache();

const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function TestProviders({
  children,
  translation,
}: {
  children: ReactNode;
  translation?: Messages;
}) {
  return (
    <ThemeContextProvider>
      <LinguiProvider translation={translation}>
        <QueryProvider>
          <Toaster />
          <ConfirmAlert />
          {children}
        </QueryProvider>
      </LinguiProvider>
    </ThemeContextProvider>
  );
}
