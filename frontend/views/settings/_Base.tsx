import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
} from "@gothicgeeks/design-system";
import { useRouter } from "next/router";
import { ReactNode } from "react";
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
                link: NAVIGATION_LINKS.SETTINGS.ENTITIES,
                name: "Entities",
              },
              {
                link: "TODO",
                name: "Other Settings",
              },
            ]}
            currentMenuItem={router.asPath}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
