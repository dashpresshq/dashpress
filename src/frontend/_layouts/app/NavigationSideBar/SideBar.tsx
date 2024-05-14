import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import Link from "next/link";

import { ChevronRight } from "react-feather";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { useThemeColorShade } from "frontend/design-system/theme/useTheme";
import { Stack } from "frontend/design-system/primitives/Stack";
import { useStorageApi } from "frontend/lib/data/useApi";
import { INavigationMenuItem } from "shared/types/menu";
import { useSessionStorage } from "react-use";
import { PlainButton } from "frontend/design-system/components/Button/TextButton";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import {
  NAVIGATION_MENU_ENDPOINT,
  SIDE_BAR_WIDTH_VARIATIONS,
} from "./constants";
import { NavigationSkeleton } from "./NavigationSkeleton";
import { ProfileOnNavigation } from "./Profile";
import { RenderNavigation } from "./RenderNavigation";

const LogoSm = styled.img`
  width: 28px;
`;

const LogoFull = styled.img`
  width: 120px;
  margin-top: 12px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
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

const IconRoot = styled.span<{ $isFullWidth: boolean }>`
  color: ${SYSTEM_COLORS.white};
  width: 32px;
  height: 32px;

  transition: transform 0.3s;
  ${(props) => props.$isFullWidth && "transform: rotate(180deg);"}
`;

const ToggleSideBarButton = styled(PlainButton)`
  height: 36px;
  background: ${USE_ROOT_COLOR("primary-color")};
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
    errorMessage: CRUD_CONFIG_NOT_FOUND(`Navigation Menu`),
    defaultData: [],
  });
};

export function SideBar({ isFullWidth, setIsFullWidth }: IProps) {
  const siteConfig = useAppConfiguration("site_settings");
  const navigationMenuItems = useNavigationMenuItems();
  const getThemeColorShade = useThemeColorShade();

  const [activeItem, setActiveItem$1] = useSessionStorage<
    Record<string, string>
  >(`navigation-current-item`, {});

  const setActiveItem = (depth: number, value: string) => {
    const newValue: Record<string, string> = { ...activeItem, [depth]: value };

    const newValueFiltered = Object.fromEntries(
      typescriptSafeObjectDotEntries(newValue).filter(([key]) => +key <= depth)
    ) as Record<string, string>;

    setActiveItem$1(newValueFiltered);
  };

  return (
    <Root $isFullWidth={isFullWidth}>
      <Brand
        style={{
          backgroundColor: getThemeColorShade("primary-color", 35),
        }}
      >
        <Link href="/">
          {isFullWidth ? (
            <LogoFull src={siteConfig.data.fullLogo} alt="full logo" />
          ) : (
            <LogoSm src={siteConfig.data.logo} alt="small logo" />
          )}
        </Link>
      </Brand>
      <Stack
        $justify="space-between"
        $direction="column"
        $spacing={0}
        style={{ height: "calc(100dvh - 50px)" }}
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
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
          </ViewStateMachine>
        </Scroll>

        <ToggleSideBarButton
          style={{
            backgroundColor: getThemeColorShade("primary-color", 30),
          }}
          onClick={() => setIsFullWidth(!isFullWidth)}
        >
          <IconRoot
            aria-label="Toggle Side Bar"
            as={ChevronRight}
            $isFullWidth={isFullWidth}
          />
        </ToggleSideBarButton>
      </Stack>
    </Root>
  );
}
