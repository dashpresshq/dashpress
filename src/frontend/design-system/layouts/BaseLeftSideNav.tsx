import Link from "next/link";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { useThemeColorShade } from "../theme/useTheme";

const StyledLogo = styled(Link)`
  line-height: 52px;
`;

const StyledLogoSm = styled.img`
  width: 28px;
  margin-top: 16px;
`;

const StyledMenuContent = styled.div`
  height: 100%;
  padding-bottom: 30px;
`;

const StyledBrand = styled.div`
  text-align: center;
  height: 52px;
  margin-top: 8px;
`;

const Root = styled.div`
  min-height: 100vh;
  transition: 0.3s;
  position: fixed;
  bottom: 0;
  top: 0;
`;

interface IProps {
  logo: string;
  children: ReactNode;
}

export function BaseLeftSideNav({ children, logo }: IProps) {
  const colorShade = useThemeColorShade();
  return (
    <Root style={{ background: colorShade("primary-color", 30) }}>
      <StyledBrand>
        <StyledLogo href="/">
          <span>
            <StyledLogoSm src={logo} alt="small logo" />
          </span>
        </StyledLogo>
      </StyledBrand>
      <StyledMenuContent>{children}</StyledMenuContent>
    </Root>
  );
}
