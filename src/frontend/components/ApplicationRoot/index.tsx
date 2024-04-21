import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "frontend/lib/data/QueryClient";
import { ThemeContextProvider } from "frontend/design-system/theme/Context";
import { GlobalStyles } from "frontend/design-system/globals";
import { useRouter } from "next/router";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

export function ApplicationRoot({
  children,
  messages,
}: {
  children: ReactNode;
  messages?: AbstractIntlMessages;
}) {
  const router = useRouter();
  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Europe/Vienna"
      messages={messages}
    >
      <QueryProvider>
        <Toaster />
        <GlobalStyles />
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
