import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
} from "@hadmean/chromista";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Calendar, Columns, Eye, Server } from "react-feather";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";

interface IProps {
  children: ReactNode;
}

export function BaseSettingsLayout({ children }: IProps) {
  const router = useRouter();
  return (
    <AppLayout>
      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[
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
              // {
              //   action: NAVIGATION_LINKS.SETTINGS.CONFIGURATIONS,
              //   name: "Configurations",
              //   IconComponent: Edit3,
              // },
            ]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
