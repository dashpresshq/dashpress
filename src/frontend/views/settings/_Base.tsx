import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
  ErrorAlert,
  Spacer,
} from "@hadmean/chromista";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import {
  Calendar,
  Columns,
  Eye,
  Server,
  Globe,
  // GitHub,
  Book,
  Terminal,
} from "react-feather";
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
      action: NAVIGATION_LINKS.SETTINGS.VARIABLES,
      name: "Variables",
      IconComponent: Book,
    },
    {
      action: NAVIGATION_LINKS.SETTINGS.VERSIONS,
      name: "Version Info",
      IconComponent: Terminal,
    },
  ];

  return (
    <AppLayout>
      {100 > 5 && (
        <>
          <ErrorAlert
            renderJsx
            // action={{
            //   action: () => window.open("https://github.com/hadmean/hadmean"),
            //   Icon: GitHub,
            //   label: "Give us a star on Github",
            // }}
            message={
              <span>
                <p>
                  <b> Awesome!,</b>
                </p>
                <p>
                  You have been using Hadmean for about a week now. Hope you are
                  enjoying it so far.
                </p>
                <p>
                  We have spent countless hours developing this free app, and we
                  would really appreciate it if you could drop a star on Github
                  to boost our motivation.
                </p>
              </span>
            }
          />
          <Spacer />
        </>
      )}

      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[...baseMenuItems]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
