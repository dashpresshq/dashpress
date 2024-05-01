import { ReactNode } from "react";
import styled from "styled-components";
import { useSessionStorage } from "react-use";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { SideBar } from "./SideBar";
import { SIDE_BAR_WIDTH_VARIATIONS } from "./constants";

export interface IProps {
  children: ReactNode;
}

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Page = styled.div<{ $isFullWidth: boolean }>`
  padding: 16px;
  min-height: 100vh;
  display: block;
  transition: all 0.3s;
  width: calc(
    100vw -
      ${(props) =>
        props.$isFullWidth
          ? SIDE_BAR_WIDTH_VARIATIONS.full
          : SIDE_BAR_WIDTH_VARIATIONS.collapsed}px - 16px
  );
  margin-left: ${(props) =>
    props.$isFullWidth
      ? SIDE_BAR_WIDTH_VARIATIONS.full
      : SIDE_BAR_WIDTH_VARIATIONS.collapsed}px;
  background: ${USE_ROOT_COLOR("foundation-color")};
`;

export function NavigationSideBar({ children }: IProps) {
  const [isFullWidth, setIsFullWidth] = useSessionStorage(
    "is-navigation-open",
    true
  );

  return (
    <Root>
      <SideBar isFullWidth={isFullWidth} setIsFullWidth={setIsFullWidth} />
      <Page $isFullWidth={isFullWidth}>{children}</Page>
    </Root>
  );
}
