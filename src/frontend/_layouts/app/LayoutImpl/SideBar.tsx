import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useSiteConfig } from "frontend/hooks/app/site.config";
import Link from "next/link";
import React from "react";
import { ChevronRight } from "react-feather";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { useThemeColorShade } from "frontend/design-system/theme/useTheme";
import { Stack } from "frontend/design-system/primitives/Stack";
import { useStorageApi } from "frontend/lib/data/useApi";
import { INavigationMenuItem } from "shared/types/menu";
import {
  NAVIGATION_MENU_ENDPOINT,
  SIDE_BAR_WIDTH_VARIATIONS,
} from "./constants";
import { NavigationSkeleton } from "./NavigationSkeleton";
import { ProfileOnNavigation } from "./Profile";
import { RenderNavigation } from "./RenderNavigation";

const StyledLogoSm = styled.img`
  width: 28px;
  margin-top: 16px;
`;

const StyledLogoFull = styled.img`
  margin-top: 16px;
  width: 120px;
`;

const StyledBrand = styled.div`
  text-align: center;
  height: 70px;
`;

const Root = styled.div<{ $isFullWidth: boolean }>`
  min-height: 100vh;
  transition: all 0.3s;
  position: fixed;
  flex: 0 0
    ${(props) =>
      props.$isFullWidth
        ? SIDE_BAR_WIDTH_VARIATIONS.full
        : SIDE_BAR_WIDTH_VARIATIONS.collapsed}px;
  max-width: ${(props) =>
    props.$isFullWidth
      ? SIDE_BAR_WIDTH_VARIATIONS.full
      : SIDE_BAR_WIDTH_VARIATIONS.collapsed}px;
  min-width: ${(props) =>
    props.$isFullWidth
      ? SIDE_BAR_WIDTH_VARIATIONS.full
      : SIDE_BAR_WIDTH_VARIATIONS.collapsed}px;
  width: ${(props) =>
    props.$isFullWidth
      ? SIDE_BAR_WIDTH_VARIATIONS.full
      : SIDE_BAR_WIDTH_VARIATIONS.collapsed}px;
`;

const StyledIconRoot = styled.span<{ $isFullWidth: boolean }>`
  color: ${SYSTEM_COLORS.white};
  width: 32px;
  height: 32px;

  transition: transform 0.3s;
  ${(props) => props.$isFullWidth && "transform: rotate(180deg);"}
`;

export const StyledPlainButton = styled.button`
  &:focus {
    outline: 0;
  }
  height: 36px;
  background: ${USE_ROOT_COLOR("primary-color")};
  border: 0;
  cursor: pointer;
  padding: 0;
`;

const Scroll = styled.div`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
interface IProps {
  isFullWidth: boolean;
  setIsFullWidth: (value: boolean) => void;
}

export const useNavigationMenuItems = () => {
  return useStorageApi<INavigationMenuItem[]>(NAVIGATION_MENU_ENDPOINT, {
    errorMessage: "Could not load navigation menu",
    defaultData: [],
  });
};

export function SideBar({ isFullWidth, setIsFullWidth }: IProps) {
  const siteConfig = useSiteConfig();
  const navigationMenuItems = useNavigationMenuItems();
  const getThemeColorShade = useThemeColorShade();

  return (
    <Root $isFullWidth={isFullWidth}>
      <StyledBrand
        style={{
          backgroundColor: getThemeColorShade("primary-color", 35),
        }}
      >
        <Link href="/">
          {isFullWidth ? (
            <StyledLogoFull src={siteConfig.fullLogo} alt="full logo" />
          ) : (
            <StyledLogoSm src={siteConfig.logo} alt="small logo" />
          )}
        </Link>
      </StyledBrand>
      <Stack
        justify="space-between"
        direction="column"
        spacing={0}
        style={{ height: "calc(100vh - 70px)" }}
      >
        <Scroll
          style={{
            backgroundColor: getThemeColorShade("primary-color", 35),
          }}
        >
          <ProfileOnNavigation isFullWidth={isFullWidth} />
          <ViewStateMachine
            loading={navigationMenuItems.isLoading}
            error={navigationMenuItems.error}
            loader={<NavigationSkeleton />}
          >
            <RenderNavigation
              navigation={navigationMenuItems.data}
              isFullWidth={isFullWidth}
              setIsFullWidth={setIsFullWidth}
            />
          </ViewStateMachine>
        </Scroll>

        <StyledPlainButton
          style={{
            backgroundColor: getThemeColorShade("primary-color", 30),
          }}
          onClick={() => setIsFullWidth(!isFullWidth)}
        >
          <StyledIconRoot as={ChevronRight} $isFullWidth={isFullWidth} />
        </StyledPlainButton>
      </Stack>
    </Root>
  );
}
