import type { ReactNode } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { msg } from "@lingui/macro";
import { ContentLayout } from "@/components/app/content-layout";
import { MenuSection } from "@/components/app/menu-section";
import type { IMenuActionItem } from "@/components/app/button/types";
import { useMutateBaseSettingsMenu } from "./portal";

interface IProps {
  children: ReactNode;
}

const baseMenuItems: IMenuActionItem[] = [
  {
    id: "settings",
    action: NAVIGATION_LINKS.SETTINGS.ENTITIES,
    label: msg`Enabled Entities`,
    systemIcon: "Columns",
    order: 10,
  },
  {
    id: "theme",
    action: NAVIGATION_LINKS.SETTINGS.THEME,
    label: msg`Theme`,
    systemIcon: "Eye",
    order: 20,
  },
  {
    id: "site",
    action: NAVIGATION_LINKS.SETTINGS.SITE,
    label: msg`Site`,
    systemIcon: "Globe",
    order: 30,
  },
  {
    id: "data",
    action: NAVIGATION_LINKS.SETTINGS.DATA,
    label: msg`General Data Settings`,
    systemIcon: "Calendar",
    order: 40,
  },
  {
    id: "variables",
    action: NAVIGATION_LINKS.SETTINGS.VARIABLES,
    label: msg`Variables`,
    systemIcon: "Book",
    order: 50,
  },
  {
    id: "system",
    action: NAVIGATION_LINKS.SETTINGS.SYSTEM,
    label: msg`System`,
    systemIcon: "Server",
    order: 60,
  },
  {
    id: "versions",
    action: NAVIGATION_LINKS.SETTINGS.VERSIONS,
    label: msg`System Info`,
    systemIcon: "Terminal",
    order: 70,
  },
];

export function BaseSettingsLayout({ children }: IProps) {
  const menuItems = useMutateBaseSettingsMenu(baseMenuItems);
  return (
    <AppLayout>
      <ContentLayout>
        <ContentLayout.Left>
          <MenuSection menuItems={menuItems} />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
