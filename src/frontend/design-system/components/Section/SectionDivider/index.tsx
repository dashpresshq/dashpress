import { ReactElement, ReactNode } from "react";
import styled from "styled-components";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Stack } from "frontend/design-system/primitives/Stack";
import { BREAKPOINTS } from "../../../constants";

interface IProps {
  children: ReactNode;
}

export const GridRoot = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 2fr 8fr;
  @media (max-width: ${BREAKPOINTS.md}) {
    grid-template-columns: 1fr;
  }
`;

type TContentLayout = ((params: IProps) => ReactElement) & {
  Left: (params: IProps) => ReactElement;
  Right: (params: IProps) => ReactElement;
  Center: (params: IProps) => ReactElement;
};

// eslint-disable-next-line react/function-component-definition
export const ContentLayout: TContentLayout = ({ children }: IProps) => {
  return <GridRoot>{children}</GridRoot>;
};

ContentLayout.Left = function SectionLeft({ children }: IProps) {
  return (
    <div>
      {children}
      <Spacer />
    </div>
  );
};

ContentLayout.Right = function SectionRight({ children }: IProps) {
  return (
    <div style={{ overflowX: "hidden", minHeight: "calc(100vh - 100px)" }}>
      {children}
    </div>
  );
};

ContentLayout.Center = function SectionCenter({ children }: IProps) {
  return (
    <Stack $justify="center">
      <div style={{ maxWidth: "1200px", width: "100%" }}>{children}</div>
    </Stack>
  );
};
