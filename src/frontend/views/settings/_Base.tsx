import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  IMenuSectionItem,
  MenuSection,
} from "frontend/design-system/components/Section/MenuSection";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { InfoAlert } from "frontend/design-system/components/Alert";
import { GitHub } from "react-feather";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { useTimeElapsedStorageState } from "frontend/hooks/state/useTimeElapsedStorageState";
import { useMutateBaseSettingsMenu } from "./portal";

interface IProps {
  children: ReactNode;
}

const baseMenuItems: IMenuSectionItem[] = [
  {
    action: NAVIGATION_LINKS.SETTINGS.ENTITIES,
    name: "Enabled Entities",
    systemIcon: "Columns",
    order: 10,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.THEME,
    name: "Theme",
    systemIcon: "Eye",
    order: 20,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.SITE,
    name: "Site",
    systemIcon: "Globe",
    order: 30,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.DATA,
    name: "General Data Settings",
    systemIcon: "Calendar",
    order: 40,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.VARIABLES,
    name: "Variables",
    systemIcon: "Book",
    order: 50,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.SYSTEM,
    name: "System",
    systemIcon: "Server",
    order: 60,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.VERSIONS,
    name: "System Info",
    systemIcon: "Terminal",
    order: 70,
  },
];

export function BaseSettingsLayout({ children }: IProps) {
  const router = useRouter();
  const menuItems = useMutateBaseSettingsMenu(baseMenuItems);
  const { state: giveUsAStarState, off: turnOffGiveUsAState } =
    useTimeElapsedStorageState("give-us-a-star", 60 * 60 * 24 * 7);
  return (
    <AppLayout>
      {giveUsAStarState && (
        <>
          <InfoAlert
            renderJsx
            action={{
              action: () => {
                window.open("https://github.com/dashpresshq/dashpress");
                turnOffGiveUsAState();
              },
              Icon: GitHub,
              label: "Give us a star on Github",
            }}
            message={
              <span>
                <p>
                  <b>Hi There!</b>
                </p>
                <p>
                  Looks like you are enjoying DashPress for about a week now, We
                  have worked hard developing this application, and you can tell
                  us thank you by giving us a star on Github. It would mean a
                  lot to us!.
                </p>
              </span>
            }
          />
          <Spacer />
        </>
      )}
      <ContentLayout>
        <ContentLayout.Left>
          <MenuSection
            menuItems={menuItems}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
