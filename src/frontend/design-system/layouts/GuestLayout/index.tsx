import React, { ReactNode } from "react";
import styled from "styled-components";
import {
  SHADOW_CSS,
  StyledCardBody,
} from "frontend/design-system/components/Card";
import { GuestFooter, GuestHeader, GuestContainer } from "./_partials";

export interface IProps {
  children: ReactNode;
  title: string;
  subTitle?: string;
  appDetails?: {
    logo?: string;
    homeLink?: string;
    name?: string;
  };
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

export function GuestLayout({
  children,
  title,
  subTitle,
  appDetails = {},
}: IProps) {
  return (
    <GuestContainer>
      <Root>
        <GuestHeader title={title} subTitle={subTitle} {...appDetails} />
        <StyledCardBody radiusLess>{children}</StyledCardBody>
        <GuestFooter name={appDetails.name} />
      </Root>
    </GuestContainer>
  );
}
