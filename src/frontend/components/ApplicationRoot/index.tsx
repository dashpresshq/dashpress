import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "frontend/lib/data/QueryClient";
import { ThemeContextProvider } from "frontend/design-system/theme/Context";
import { GlobalStyles } from "frontend/design-system/globals";
import { LinguiProvider } from "translations/utils";
import { Messages } from "@lingui/core";

export function ApplicationRoot({
  children,
  translation,
}: {
  children: ReactNode;
  translation?: Messages;
}) {
  return (
    <LinguiProvider translation={translation}>
      <QueryProvider>
        <Toaster />
        <GlobalStyles />
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </QueryProvider>
    </LinguiProvider>
  );
}
