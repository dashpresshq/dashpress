import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "frontend/lib/data/QueryClient";
import { LinguiProvider } from "translations/utils";
import { Messages } from "@lingui/core";
import { PortalProvider } from "frontend/_layouts/app/portal";
import { GoogleTagManager } from "frontend/_layouts/scripts/GoogleTagManager";
import { ThemeProvider } from "next-themes";
import { ConfirmAlert } from "./confirm-alert";

export function ApplicationRoot({
  children,
  translation,
}: {
  children: ReactNode;
  translation?: Messages;
}) {
  return (
    <ThemeProvider
      themes={[
        "light",
        "dark",
        "gruv_box",
        "high_contrast",
        "solarized_dark",
        "solarized_light",
        "nord",
      ]}
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
