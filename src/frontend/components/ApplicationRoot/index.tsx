import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "frontend/lib/data/QueryClient";
import { ThemeContextProvider } from "frontend/design-system/theme/Context";
import "../static/fonts/font-face.css";
import { GlobalStyles } from "frontend/design-system/globals";

export function ApplicationRoot({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <Toaster />
      <GlobalStyles />
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </QueryProvider>
  );
}
