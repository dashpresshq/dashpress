import { ReactElement, ReactNode } from "react";
import styled from "styled-components";
import { BREAKPOINTS } from "@/frontend/design-system/constants";

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
  return <div className="mb-4">{children}</div>;
};

ContentLayout.Right = function SectionRight({ children }: IProps) {
  return (
    <div className="overflow-x-hidden min-h-[calc(100vh-100px)] mb-4">
      {children}
    </div>
  );
};

ContentLayout.Center = function SectionCenter({ children }: IProps) {
  return (
    <div className="flex justify-center mb-4">
      <div className="max-w-[1200px] w-full">{children}</div>
    </div>
  );
};
