import React from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import {
  INavigationMenuItem,
  NavigationMenuItemType,
  SystemLinks,
} from "shared/types/menu";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { systemIconToSVG } from "shared/constants/Icons";
import { ChevronRight } from "react-feather";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { Typo } from "frontend/design-system/primitives/Typo";
import { PlainButton } from "frontend/design-system/components/Button/TextButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { useThemeColorShade } from "frontend/design-system/theme/useTheme";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { ActionIntegrationKeys } from "shared/types/actions";

const LeftSideNavMenuList = styled.li<{}>`
  list-style: none;
  display: block;
  transition: all 0.3s;
`;

const LeftSideNavMenuListAnchor = styled.a<{
  hoverColor: string;
  $isActive: boolean;
  $depth: number;
}>`
  border-left: 2px solid transparent;
  ${(props) =>
    props.$isActive &&
    css`
      border-color: ${SYSTEM_COLORS.white};
    `}
  display: flex;
  color: ${SYSTEM_COLORS.white};
  align-items: center;
  width: 100%;
  outline: none !important;
  padding: 12px 16px;
  padding-left: ${(props) => props.$depth * 16}px;
  &:hover {
    color: ${SYSTEM_COLORS.white};
    background: ${(props) => props.hoverColor};
  }
`;

const IconRoot = styled.span<{ $isFullWidth: boolean }>`
  color: ${SYSTEM_COLORS.white};
  width: 20px;
  height: 20px;
  display: inline-block;
  svg {
    vertical-align: initial;
  }
`;

const LeftSideNavMenu = styled.ul<{}>`
  padding: 0;
  margin-bottom: 0;
`;

const NavLabel = styled(Typo.XS)<{ $isFullWidth: boolean }>`
  color: ${SYSTEM_COLORS.white};
  margin-left: 20px;
  transition: all 0.3s;
  ${(props) =>
    !props.$isFullWidth &&
    `
    display: none;
  `}
`;

const NavHeader = styled(Typo.XS)<{ $isFullWidth: boolean }>`
  color: ${SYSTEM_COLORS.white};
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  margin: 24px 0 8px 16px;
  transition: all 0.3s;
  ${(props) =>
    !props.$isFullWidth &&
    `
    display: none;
  `}
`;

const SubMenuArrow = styled(ChevronRight)<{
  $isActive: boolean;
  $isFullWidth: boolean;
}>`
  fill: ${SYSTEM_COLORS.white}
  cursor: pointer;
  margin-left: 0px;
  transition: transform 0.3s;
  ${(props) => props.$isActive && "transform: rotate(90deg);"}
  ${(props) =>
    !props.$isFullWidth &&
    `
    display: none;
  `}
`;

interface IProp {
  navigation: INavigationMenuItem[];
  isFullWidth: boolean;
  setIsFullWidth: (value: boolean) => void;
  depth?: number;
  activeItem: Record<string, string>;
  setActiveItem: (depth: number, value: string) => void;
}

const SYSTEM_LINK_MAP: Record<SystemLinks, string> = {
  [SystemLinks.Settings]: NAVIGATION_LINKS.SETTINGS.DEFAULT,
  [SystemLinks.Home]: NAVIGATION_LINKS.DASHBOARD.HOME,
  [SystemLinks.Roles]: NAVIGATION_LINKS.ROLES.LIST,
  [SystemLinks.Users]: NAVIGATION_LINKS.USERS.LIST,
  [SystemLinks.Integrations]: NAVIGATION_LINKS.INTEGRATIONS.ACTIONS(
    ActionIntegrationKeys.HTTP
  ),
  [SystemLinks.AllDashboards]: NAVIGATION_LINKS.DASHBOARD.CUSTOM.LIST,
};

const getNavigationTypeLink = (
  type: NavigationMenuItemType,
  link?: string
): string => {
  switch (type) {
    case NavigationMenuItemType.Header:
      return "#";
    case NavigationMenuItemType.ExternalLink:
      return link;
    case NavigationMenuItemType.Dashboard:
      return NAVIGATION_LINKS.DASHBOARD.CUSTOM.VIEW(link);
    case NavigationMenuItemType.Entities:
      return NAVIGATION_LINKS.ENTITY.TABLE(link);
    case NavigationMenuItemType.System:
      return SYSTEM_LINK_MAP[link];
  }
};

export function RenderNavigation({
  navigation,
  isFullWidth,
  setIsFullWidth,
  depth = 1,
  setActiveItem,
  activeItem,
}: IProp) {
  const { clear: clearBreadCrumbStack } = useNavigationStack();

  const getBackgroundColor = useThemeColorShade();

  return (
    <LeftSideNavMenu>
      {navigation.map(({ title, icon, type, link, id, children }) => {
        const isActive = activeItem[depth] === id;

        const iconComponent = (
          <IconRoot
            $isFullWidth={isFullWidth}
            dangerouslySetInnerHTML={{
              __html: systemIconToSVG(icon, isActive ? 2 : 1),
            }}
          />
        );

        return (
          <LeftSideNavMenuList key={id}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {type === NavigationMenuItemType.Header ? (
              <NavHeader $isFullWidth={isFullWidth}>{title}</NavHeader>
            ) : children && children.length > 0 ? (
              <>
                <LeftSideNavMenuListAnchor
                  as={PlainButton}
                  $isActive={false}
                  $depth={depth}
                  hoverColor={getBackgroundColor("primary-color", 45)}
                  onClick={() => {
                    clearBreadCrumbStack();
                    setIsFullWidth(true);
                    setActiveItem(depth, isActive ? "" : id);
                  }}
                >
                  {iconComponent}
                  {isFullWidth && (
                    <Stack justify="space-between" spacing={0} align="center">
                      <NavLabel ellipsis $isFullWidth={isFullWidth}>
                        {title}
                      </NavLabel>
                      <SubMenuArrow
                        $isFullWidth={isFullWidth}
                        size={16}
                        $isActive={isActive}
                      />
                    </Stack>
                  )}
                </LeftSideNavMenuListAnchor>
                {isActive && isFullWidth && (
                  <RenderNavigation
                    setIsFullWidth={setIsFullWidth}
                    navigation={children}
                    isFullWidth={isFullWidth}
                    depth={depth + 1}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                  />
                )}
              </>
            ) : (
              <Link href={getNavigationTypeLink(type, link)} passHref>
                <LeftSideNavMenuListAnchor
                  $isActive={isActive}
                  $depth={depth}
                  onClick={() => {
                    clearBreadCrumbStack();
                    setActiveItem(depth, id);
                  }}
                  target={
                    type === NavigationMenuItemType.ExternalLink
                      ? "_blank"
                      : undefined
                  }
                  hoverColor={getBackgroundColor("primary-color", 45)}
                >
                  {icon && iconComponent}
                  <NavLabel ellipsis $isFullWidth={isFullWidth}>
                    {title}
                  </NavLabel>
                </LeftSideNavMenuListAnchor>
              </Link>
            )}
          </LeftSideNavMenuList>
        );
      })}
    </LeftSideNavMenu>
  );
}
