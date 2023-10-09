import React, { ReactNode } from "react";
import Head from "next/head";
import { GuestLayout } from "frontend/design-system/layouts/GuestLayout";
import { useSiteConfig } from "frontend/hooks/app/site.config";
import { useAppTheme } from "../useAppTheme";
import { GoogleTagManager } from "../scripts/GoogleTagManager";
import { PortalProvider } from "../app/portal";

interface IProps {
  children: ReactNode;
  title: string;
  subTitle: string;
}

export function AuthLayout({ children, title, subTitle }: IProps) {
  const siteConfig = useSiteConfig();
  useAppTheme();

  return (
    <PortalProvider>
      <GuestLayout
        title={title}
        subTitle={subTitle}
        appDetails={{ ...siteConfig, logo: siteConfig.fullLogo }}
      >
        <Head>
          <title>
            {title} - {siteConfig.name}
          </title>
        </Head>
        {children}
        <GoogleTagManager />
      </GuestLayout>
    </PortalProvider>
  );
}
