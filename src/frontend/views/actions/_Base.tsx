import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
} from "@hadmean/chromista";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";

interface IProps {
  children: ReactNode;
}

export function BaseActionsLayout({ children }: IProps) {
  const router = useRouter();

  return (
    <AppLayout>
      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[
              {
                action: NAVIGATION_LINKS.ACTIONS.DETAILS("foo"),
                name: "Entities",
              },
            ]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
