import { GuestLayout } from "@gothicgeeks/design-system";
import React, { ReactNode } from "react";
import Head from "next/head";
import { useSiteConfig } from "../../hooks/app/site.config";

interface IProps {
  children: ReactNode;
  title: string;
  subTitle: string;
}

export function AuthLayout({ children, title, subTitle }: IProps) {
  const siteConfig = useSiteConfig();

  return (
    <GuestLayout title={title} subTitle={subTitle} appDetails={siteConfig}>
      <Head>
        <title>
          {title} - {siteConfig.name}
        </title>
      </Head>
      {children}
    </GuestLayout>
  );
}
