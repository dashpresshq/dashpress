import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  IMenuSectionItem,
  MenuSection,
} from "frontend/design-system/components/Section/MenuSection";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { msg } from "@lingui/macro";
import { useMutateBaseSettingsMenu } from "./portal";

interface IProps {
  children: ReactNode;
}

const baseMenuItems: IMenuSectionItem[] = [
  {
    action: NAVIGATION_LINKS.SETTINGS.ENTITIES,
    name: msg`Enabled Entities`,
    systemIcon: "Columns",
    order: 10,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.THEME,
    name: msg`Theme`,
    systemIcon: "Eye",
    order: 20,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.SITE,
    name: msg`Site`,
    systemIcon: "Globe",
    order: 30,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.DATA,
    name: msg`General Data Settings`,
    systemIcon: "Calendar",
    order: 40,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.VARIABLES,
    name: msg`Variables`,
    systemIcon: "Book",
    order: 50,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.SYSTEM,
    name: msg`System`,
    systemIcon: "Server",
    order: 60,
  },
  {
    action: NAVIGATION_LINKS.SETTINGS.VERSIONS,
    name: msg`System Info`,
    systemIcon: "Terminal",
    order: 70,
  },
];

export function BaseSettingsLayout({ children }: IProps) {
  const router = useRouter();
  const menuItems = useMutateBaseSettingsMenu(baseMenuItems);
  return (
    <AppLayout>
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
