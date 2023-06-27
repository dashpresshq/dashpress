import React from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { ISelectionView } from "./types";
import { PlainButton } from "../components/Button/TextButton";

interface IRenderNavigation {
  navigation: Array<ISelectionView & { sideBarAction: () => void }>;
  currentTitle: string;
}

const StyledLeftSideNavMenuList = styled.li<{ $isActive: boolean }>`
  list-style: none;
  display: block;
  width: 100%;
  padding: 6px 12px;
  border-left: 2px solid transparent;

  ${(props) =>
    props.$isActive &&
    css`
      border-color: ${USE_ROOT_COLOR("text-on-primary")};
    `}
`;

const StyledLeftSideNavMenuListAnchor = styled.a`
  display: flex;
  align-items: center;
  width: 100%;
  outline: none !important;
  padding: 4px 0px;
  font-size: 13px;

  transition: all 0.3s ease-out;
  font-weight: 400;
  background: inherit;
  border: 0;
  margin: 0;

  &:hover {
    color: ${USE_ROOT_COLOR("primary-color")};
  }
`;

const StyleMenuIcon = styled.span<{
  $isActive?: boolean;
}>`
  color: ${USE_ROOT_COLOR("text-on-primary")};
  margin-right: 0;
  width: 28px;
  height: 28px;
  stroke-width: ${(props) => (props.$isActive ? 2 : 1)}px;
  align-self: center;
  display: inline-block;
`;

const StyledLeftSideNavMenu = styled.ul`
  padding-left: 0;
  margin-bottom: 0;

  hr:first-child {
    display: none;
  }
`;

export function RenderNavigation({
  navigation,
  currentTitle,
}: IRenderNavigation) {
  return (
    <StyledLeftSideNavMenu>
      {navigation.map(
        ({ title, icon, action, sideBarAction, secondaryAction }) => {
          const isActive = currentTitle === title;
          const content = <StyleMenuIcon as={icon} $isActive={isActive} />;
          return (
            <StyledLeftSideNavMenuList
              key={title}
              $isActive={isActive}
              className="brand-tooltip"
            >
              {typeof action === "string" ? (
                <Link href={action || ""} passHref>
                  <StyledLeftSideNavMenuListAnchor
                    onClick={() => {
                      sideBarAction();
                      secondaryAction?.();
                    }}
                  >
                    {content}
                  </StyledLeftSideNavMenuListAnchor>
                </Link>
              ) : (
                <StyledLeftSideNavMenuListAnchor
                  as={PlainButton}
                  onClick={() => {
                    action?.();
                    sideBarAction();
                    secondaryAction?.();
                  }}
                >
                  {content}
                </StyledLeftSideNavMenuListAnchor>
              )}
            </StyledLeftSideNavMenuList>
          );
        }
      )}
    </StyledLeftSideNavMenu>
  );
}
