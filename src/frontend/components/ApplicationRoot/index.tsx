import React, { ReactNode } from "react";
import { QueryProvider } from "@hadmean/protozoa";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider } from "frontend/design-system/theme/Context";
import { GlobalStyles } from "../../design-system/globals";
import "../static/fonts/font-face.css";

export function ApplicationRoot({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <Toaster />
      <GlobalStyles />
      <ThemeContextProvider>{children}</ThemeContextProvider>
    </QueryProvider>
  );
}
