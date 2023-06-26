import React, { ReactNode } from "react";
import styled from "styled-components";
import shallow from "zustand/shallow";
import { USE_ROOT_COLOR } from "../../theme";
import { useSideBarStore } from "../sidebar.store";
import { ISelectionView } from "../types";
import { PrimaryLeftSideNav } from "./PrimaryLeftSideNav";
import { SecondaryLeftSideNav } from "./SecondarySideNav";

export interface IProps {
  children: ReactNode;
  logo?: string;
  selectionView: ISelectionView[];
  secondarySelectionView?: ISelectionView[];
}

const Root = styled.div`
  width: 100%;
  overflow-x: hidden;
`;

const StyledPage = styled.div<{ isSidebarOpen: boolean }>`
  padding: 16px;
  min-height: 100vh;
  display: block;
  margin-left: ${(props) => (props.isSidebarOpen ? 350 : 50)}px;
  width: calc(100vw - ${(props) => (props.isSidebarOpen ? 350 : 50)}px);
  background: ${USE_ROOT_COLOR("foundation-color")};
`;

export function DynamicLayout({
  logo = "/assets/images/logo.png",
  children,
  selectionView,
  secondarySelectionView = [],
}: IProps) {
  const [isFullSideBarOpen] = useSideBarStore(
    (state) => [state.isFullSideBarOpen],
    shallow
  );
  return (
    <Root>
      <PrimaryLeftSideNav
        logo={logo}
        navigation={selectionView}
        secondaryNavigation={secondarySelectionView}
      />
      <SecondaryLeftSideNav selectionView={selectionView} />
      <StyledPage isSidebarOpen={isFullSideBarOpen}>{children}</StyledPage>
    </Root>
  );
}
