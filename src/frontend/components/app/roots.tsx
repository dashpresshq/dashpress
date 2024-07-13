import type { Messages } from "@lingui/core";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { LinguiProvider } from "translations/utils";

import { PortalProvider } from "@/frontend/_layouts/app/portal";
import { GoogleTagManager } from "@/frontend/_layouts/scripts/GoogleTagManager";
import { QueryProvider } from "@/frontend/lib/data/QueryClient";

import { ConfirmAlert } from "./confirm-alert";
import { Toaster } from "./toast/toaster";

export function ApplicationRoot({
  children,
  translation,
}: {
  children: ReactNode;
  translation?: Messages;
}) {
  return (
    <ThemeProvider
      themes={["light", "dark"].sort((a, b) => a.localeCompare(b))}
    >
      <LinguiProvider translation={translation}>
        <QueryProvider>
          <Toaster />
          <ConfirmAlert />
          <PortalProvider>{children}</PortalProvider>
          <GoogleTagManager />
        </QueryProvider>
      </LinguiProvider>
    </ThemeProvider>
  );
}
