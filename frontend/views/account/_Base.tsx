import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
} from "@adminator/chromista";
import { AuthService } from "@adminator/protozoa";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";

interface IProps {
  children: ReactNode;
}

export function BaseAccountLayout({ children }: IProps) {
  const router = useRouter();
  return (
    <AppLayout>
      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[
              {
                action: NAVIGATION_LINKS.ACCOUNT.PROFILE,
                name: "Profile",
              },
              {
                action: NAVIGATION_LINKS.ACCOUNT.PASSWORD,
                name: "Password",
              },
              {
                action: () => {
                  AuthService.removeAuthToken();
                  router.replace(NAVIGATION_LINKS.AUTH_SIGNIN);
                },
                name: "Log Out",
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
