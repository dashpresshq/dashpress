import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  Calendar,
  Columns,
  Eye,
  Server,
  Globe,
  Book,
  Terminal,
} from "react-feather";
import {
  IMenuSectionItem,
  MenuSection,
} from "frontend/design-system/components/Section/MenuSection";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useMutateBaseSettingsMenu } from "./portal";

interface IProps {
  children: ReactNode;
}

const baseMenuItems: IMenuSectionItem[] = [
  {
    action: NAVIGATION_LINKS.SETTINGS.ENTITIES,
    name: "Enabled Entities",
    IconComponent: Columns,
    order: 10,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.THEME,
    name: "Theme",
    IconComponent: Eye,
    order: 20,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.SITE,
    name: "Site",
    IconComponent: Globe,
    order: 30,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.DATE,
    name: "Date Format",
    IconComponent: Calendar,
    order: 40,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.VARIABLES,
    name: "Variables",
    IconComponent: Book,
    order: 50,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.SYSTEM,
    name: "System",
    IconComponent: Server,
    order: 60,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.VERSIONS,
    name: "System Info",
    IconComponent: Terminal,
    order: 70,
  },
];

export function BaseSettingsLayout({ children }: IProps) {
  const router = useRouter();
  const menuItems = useMutateBaseSettingsMenu(baseMenuItems);
  return (
    <AppLayout>
      {/* {false && ( // TODO log the user who click on the button to not disturb again
        <>
          <InfoAlert
            renderJsx
            action={{
              action: () =>
                window.open("https://github.com/dashpresshq/dashpress"),
              Icon: GitHub,
              label: "Give us a star on Github",
            }}
            message={
              <span>
                <p>
                  <b> Awesome!,</b>
                </p>
                <p>
                  You have been using DashPress for about a week now. Hope you
                  are enjoying it so far.
                </p>
                <p>
                  We have spent countless hours developing this free app, and we
                  would really appreciate it if you could drop a star on Github, 
                  It would mean a lot to us
                </p>
              </span>
            }
          />
          <Spacer />
        </>
      )} */}
      <ContentLayout>
        <ContentLayout.Left>
          <MenuSection
            menuItems={[...menuItems]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
