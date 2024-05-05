import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "frontend/lib/data/QueryClient";
import { ThemeContextProvider } from "frontend/design-system/theme/Context";
import { GlobalStyles } from "frontend/design-system/globals";
import { LinguiProvider } from "translations/utils";
import { Messages } from "@lingui/core";
import { ConfirmAlert } from "frontend/design-system/components/ConfirmAlert";
import { PortalProvider } from "frontend/_layouts/app/portal";
import { GoogleTagManager } from "frontend/_layouts/scripts/GoogleTagManager";

export function ApplicationRoot({
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
          <GlobalStyles />
          <ConfirmAlert />
          <PortalProvider>{children}</PortalProvider>
          <GoogleTagManager />
        </QueryProvider>
      </LinguiProvider>
    </ThemeContextProvider>
  );
}
