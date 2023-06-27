import React from "react";
import shallow from "zustand/shallow";
import styled from "styled-components";
import {
  SHADOW_CSS,
  StyledCardBody,
} from "frontend/design-system/components/Card";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Divider } from "frontend/design-system/primitives/Divider";
import { Typo } from "frontend/design-system/primitives/Text";
import { useSideBarStore } from "../sidebar.store";
import { ISelectionView } from "../types";
import { ViewMenuItems } from "./ViewMenuItems";

interface IProps {
  selectionView: ISelectionView[];
}

const StyledHideScrollbar = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  height: 101vh;
  ${SHADOW_CSS};
`;

const Root = styled.div<{ show: boolean }>`
  height: 100vh;
  left: 54px;
  position: fixed;
  width: 296px;
  order: 1;
  z-index: 10;
  display: ${({ show }) => (show ? "block" : "none")};
`;

const StyledRenderView = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? "block" : "none")};
`;

export function SecondaryLeftSideNav({ selectionView }: IProps) {
  const [isFullSideBarOpen, currentMiniSideBar, closeFullSideBar] =
    useSideBarStore(
      (state) => [
        state.isFullSideBarOpen,
        state.currentMiniSideBar,
        state.closeFullSideBar,
      ],
      shallow
    );

  return (
    <Root show={!!currentMiniSideBar && isFullSideBarOpen}>
      <StyledHideScrollbar>
        {selectionView.map(({ view, action, title, viewMenuItems }) => {
          if (!view && !viewMenuItems && !action) {
            throw new Error(
              "Please pass what to render in the view, The view` or `viewMenuItems` is required to do this or pass the `action` prop to just go to a page"
            );
          }
          return (
            <StyledRenderView key={title} show={title === currentMiniSideBar}>
              <StyledCardBody radiusLess>
                <Stack justify="space-between" align="center">
                  <Typo.MD weight="bold" ellipsis>
                    {title}
                  </Typo.MD>
                  <SoftButton
                    action={closeFullSideBar}
                    icon="close"
                    label="Close Sidebar"
                    justIcon
                  />
                </Stack>
              </StyledCardBody>
              <Divider />
              <StyledCardBody radiusLess>
                {view ||
                  (viewMenuItems && (
                    <ViewMenuItems viewMenuItems={viewMenuItems} />
                  ))}
              </StyledCardBody>
            </StyledRenderView>
          );
        })}
      </StyledHideScrollbar>
    </Root>
  );
}
