import React, { useCallback, useMemo } from "react";
import { Stack } from "frontend/design-system/primitives/Stack";
import { BaseLeftSideNav } from "../BaseLeftSideNav";
import { RenderNavigation } from "../Navigation";
import { useSideBarStore } from "../sidebar.store";
import { ISelectionView } from "../types";

interface IProps {
  logo: string;
  navigation: ISelectionView[];
  secondaryNavigation: ISelectionView[];
}

export function PrimaryLeftSideNav({
  logo,
  navigation,
  secondaryNavigation,
}: IProps) {
  const [selectMiniSideBar, closeFullSideBar, currentTitle, setCurrentTitle] =
    useSideBarStore((state) => [
      state.selectMiniSideBar,
      state.closeFullSideBar,
      state.currentTitle,
      state.setCurrentTitle,
    ]);

  const mapMapNavigationToUse = useCallback(
    (navigation$1: ISelectionView[]) => {
      return navigation$1.map(({ action, title, ...rest }) => ({
        ...rest,
        action,
        title,
        sideBarAction: () => {
          if (typeof action === "string") {
            closeFullSideBar();
          } else {
            selectMiniSideBar(title);
          }
          setCurrentTitle(title);
        },
      }));
    },
    [selectMiniSideBar]
  );

  const navigationToUse = useMemo(
    () => mapMapNavigationToUse(navigation),
    [navigation]
  );

  const secondaryNavigationToUse = useMemo(
    () => mapMapNavigationToUse(secondaryNavigation),
    [secondaryNavigation]
  );

  return (
    <BaseLeftSideNav logo={logo}>
      <Stack
        justify="space-between"
        direction="column"
        style={{ height: "calc(100% - 48px)", marginTop: "12px" }}
      >
        <RenderNavigation
          navigation={navigationToUse}
          currentTitle={currentTitle}
        />
        <RenderNavigation
          navigation={secondaryNavigationToUse}
          currentTitle={currentTitle}
        />
      </Stack>
    </BaseLeftSideNav>
  );
}
