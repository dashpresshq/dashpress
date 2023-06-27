import React from "react";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { StyledCardBody } from "frontend/design-system/components/Card";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Typo } from "frontend/design-system/primitives/Typo";

const Root = styled(StyledCardBody)`
  background-color: ${USE_ROOT_COLOR("primary-color")};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  padding: 0px;
  text-align: center;
  padding: 1rem;
`;

interface IProps {
  title: string;
  subTitle?: string;
  logo?: string;
  homeLink?: string;
}

export function GuestHeader({
  title,
  subTitle,
  logo = "/assets/images/logo.png",
  homeLink = "/",
}: IProps) {
  return (
    <Root>
      <a href={homeLink}>
        <img src={logo} height="50" alt="logo" />
        <Spacer />
        <Typo.MD color="inverse">{title}</Typo.MD>
        <Spacer size="xs" />
        {subTitle ? <Typo.XS color="inverse">{subTitle}</Typo.XS> : null}
      </a>
    </Root>
  );
}
