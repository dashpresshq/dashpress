import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
} from "@hadmean/chromista";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Calendar, Columns, Eye, Server, Globe, Edit3 } from "react-feather";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";

interface IProps {
  children: ReactNode;
}

export function BaseSettingsLayout({ children }: IProps) {
  const router = useRouter();
  const baseMenuItems = [
    {
      action: NAVIGATION_LINKS.SETTINGS.ENTITIES,
      name: "Entities",
      IconComponent: Columns,
    },
    {
      action: NAVIGATION_LINKS.SETTINGS.DATE,
      name: "Date Format",
      IconComponent: Calendar,
    },
    {
      action: NAVIGATION_LINKS.SETTINGS.SYSTEM,
      name: "System",
      IconComponent: Server,
    },
    {
      action: NAVIGATION_LINKS.SETTINGS.THEME,
      name: "Theme",
      IconComponent: Eye,
    },
    {
      action: NAVIGATION_LINKS.SETTINGS.SITE,
      name: "Site",
      IconComponent: Globe,
    },
    {
      action: NAVIGATION_LINKS.SETTINGS.CONFIGURATIONS,
      name: "Variables",
      IconComponent: Edit3,
    },
  ];

  const featureFlagMenuItems = process.env.NEXT_PUBLIC_SHOW_UNFINISHED_FEATURES
    ? []
    : [];
  return (
    <AppLayout>
      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[...baseMenuItems, ...featureFlagMenuItems]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
