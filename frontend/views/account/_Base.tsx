import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
} from "@gothicgeeks/design-system";
import { AuthService } from "@gothicgeeks/shared";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";

interface IProps {
  children: ReactNode;
  menuItem: { link: string; name: string };
}

export function BaseAccountLayout({ children, menuItem }: IProps) {
  const router = useRouter();
  return (
    <AppLayout
      titleNeedsContext
      breadcrumbs={[{ label: menuItem.name, value: menuItem.link }]}
    >
      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[
              {
                link: NAVIGATION_LINKS.ACCOUNT.PROFILE,
                name: "Profile",
              },
              {
                link: NAVIGATION_LINKS.ACCOUNT.PASSWORD,
                name: "Password",
              },
              {
                link: "",
                action: () => {
                  AuthService.removeAuthToken();
                  router.replace(NAVIGATION_LINKS.AUTH_SIGNIN);
                },
                name: "Log Out",
              },
            ]}
            currentMenuItem={menuItem.link}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
