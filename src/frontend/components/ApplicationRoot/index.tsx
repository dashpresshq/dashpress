import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "frontend/lib/data/QueryClient";
import { ThemeContextProvider } from "frontend/design-system/theme/Context";
import { GlobalStyles } from "frontend/design-system/globals";
import { useLinguiInit } from "translations/utils";
import { I18nProvider } from "@lingui/react";
import { Messages } from "@lingui/core";

export function ApplicationRoot({
  children,
  translation,
}: {
  children: ReactNode;
  translation?: Messages;
}) {
  const initializedI18n = useLinguiInit(translation);

  return (
    <I18nProvider i18n={initializedI18n}>
      <QueryProvider>
        <Toaster />
        <GlobalStyles />
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </QueryProvider>
    </I18nProvider>
  );
}
