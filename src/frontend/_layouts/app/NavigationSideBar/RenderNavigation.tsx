import styled, { css } from "styled-components";
import Link from "next/link";
import {
  HeaderMenuItemType,
  INavigationMenuItem,
  NavigationMenuItemType,
  SystemLinks,
} from "shared/types/menu";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { ChevronRight } from "react-feather";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { Typo } from "frontend/design-system/primitives/Typo";
import { PlainButton } from "frontend/design-system/components/Button/TextButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { useThemeColorShade } from "frontend/design-system/theme/useTheme";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { ActionIntegrations } from "shared/types/actions";
import { SystemIcon } from "frontend/design-system/Icons/System";
import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { fakeMessageDescriptor } from "translations/fake";
import { useLingui } from "@lingui/react";
import { PORTAL_SYSTEM_LINK_CONFIG_LINKS } from "./portal";

const SYSTEM_LINKS_CONFIG_MAP: Record<
  SystemLinks,
  {
    link: string;
    title: MessageDescriptor;
  }
> = {
  [SystemLinks.Settings]: {
    link: NAVIGATION_LINKS.SETTINGS.DEFAULT,
    title: msg`App Settings`,
  },
  [SystemLinks.Home]: {
    link: NAVIGATION_LINKS.DASHBOARD.HOME,
    title: msg`Home`,
  },
  [SystemLinks.Roles]: {
    link: NAVIGATION_LINKS.ROLES.LIST,
    title: msg`Roles`,
  },
  [SystemLinks.Users]: {
    link: NAVIGATION_LINKS.USERS.LIST,
    title: msg`Users`,
  },
  [SystemLinks.Integrations]: {
    link: NAVIGATION_LINKS.INTEGRATIONS.ACTIONS(ActionIntegrations.HTTP),
    title: msg`Integrations`,
  },
};

const HEADER_MENU_CONFIG_MAP: Record<
  HeaderMenuItemType,
  {
    title: MessageDescriptor;
  }
> = {
  [HeaderMenuItemType.Accounts]: {
    title: msg`Accounts`,
  },
  [HeaderMenuItemType.AppNavigation]: {
    title: msg`App Navigation`,
  },
  [HeaderMenuItemType.Configurations]: {
    title: msg`Configurations`,
  },
};

const LeftSideNavMenuList = styled.li<{}>`
  list-style: none;
  display: block;
  transition: all 0.3s;
`;

const LeftSideNavMenuListAnchor = styled(PlainButton)<{
  $hoverColor: string;
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
  padding: 10px 16px;
  padding-left: ${(props) => props.$depth * 16}px;
  &:hover {
    color: ${SYSTEM_COLORS.white};
    background: ${(props) => props.$hoverColor};
  }
`;

const LeftSideNavMenu = styled.ul<{}>`
  padding: 0;
  margin-bottom: 0;
  margin-top: 10px;
`;

const NavLabel = styled(Typo.XS)<{ $isFullWidth: boolean }>`
  color: ${SYSTEM_COLORS.white};
  font-size: 14px;
  margin-left: 8px;
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
  margin: 20px 0 8px 16px;
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

const getNavigationDetails = ({
  title,
  type,
  link,
}: {
  type: NavigationMenuItemType;
  title: string;
  link?: string;
}): { link: string; title: MessageDescriptor } => {
  switch (type) {
    case NavigationMenuItemType.Header:
      return {
        link: "#",
        title:
          HEADER_MENU_CONFIG_MAP[link]?.title || fakeMessageDescriptor(title),
      };
    case NavigationMenuItemType.ExternalLink:
      return { link, title: fakeMessageDescriptor(title) };
    case NavigationMenuItemType.Dashboard:
      return {
        link: NAVIGATION_LINKS.DASHBOARD.CUSTOM.VIEW(link),
        title: fakeMessageDescriptor(title),
      };
    case NavigationMenuItemType.Entities:
      return {
        link: NAVIGATION_LINKS.ENTITY.TABLE(link),
        title: fakeMessageDescriptor(title),
      };
    case NavigationMenuItemType.System:
      return (
        { ...SYSTEM_LINKS_CONFIG_MAP, ...PORTAL_SYSTEM_LINK_CONFIG_LINKS }[
          link as SystemLinks
        ] || { link: "/", title: fakeMessageDescriptor(title) }
      );
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
  const { _ } = useLingui();
  const getBackgroundColor = useThemeColorShade();

  return (
    <LeftSideNavMenu>
      {navigation.map(
        ({ title: title$1, icon, type, link: link$1, id, children }) => {
          const isActive = activeItem[depth] === id;

          const { link, title: title$2 } = getNavigationDetails({
            type,
            link: link$1,
            title: title$1,
          });

          const title = _(title$2);

          const menuIcon = depth === 1 && (
            <SystemIcon strokeWidth={isActive ? 2 : 1} icon={icon} size={20} />
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
                    $hoverColor={getBackgroundColor("primary-color", 45)}
                    onClick={() => {
                      clearBreadCrumbStack();
                      setIsFullWidth(true);
                      setActiveItem(depth, isActive ? "" : id);
                    }}
                  >
                    {menuIcon}
                    {isFullWidth && (
                      <Stack
                        $justify="space-between"
                        $spacing={0}
                        $align="center"
                      >
                        <NavLabel $isFullWidth={isFullWidth}>{title}</NavLabel>
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
                <LeftSideNavMenuListAnchor
                  as={Link}
                  href={link}
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
                  $hoverColor={getBackgroundColor("primary-color", 45)}
                >
                  {icon && menuIcon}
                  <NavLabel $isFullWidth={isFullWidth}>{title}</NavLabel>
                </LeftSideNavMenuListAnchor>
              )}
            </LeftSideNavMenuList>
          );
        }
      )}
    </LeftSideNavMenu>
  );
}
