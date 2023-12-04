import React, { ReactNode } from "react";
import Head from "next/head";
import styled from "styled-components";
import { SHADOW_CSS, CardBody } from "frontend/design-system/components/Card";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useAppTheme } from "../useAppTheme";
import { GoogleTagManager } from "../scripts/GoogleTagManager";
import { PortalProvider } from "../app/portal";

import { GuestHeader, GuestContainer } from "./_partials";

interface IProps {
  children: ReactNode;
  title: string;
  subTitle: string;
}

const Root = styled.div`
  ${SHADOW_CSS}
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-width: 0px;
  width: 100%;
  max-width: 500px;
`;

export function AuthLayout({ children, title, subTitle }: IProps) {
  const siteConfig = useAppConfiguration("site_settings");
  useAppTheme();

  return (
    <PortalProvider>
      <Head>
        <title>
          {title} - {siteConfig.data.name}
        </title>
      </Head>
      <GuestContainer>
        <Root>
          <GuestHeader title={title} subTitle={subTitle} {...siteConfig} />
          <CardBody>{children}</CardBody>
        </Root>
      </GuestContainer>
      <GoogleTagManager />
    </PortalProvider>
  );
}
