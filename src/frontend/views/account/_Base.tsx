import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
} from "@hadmean/chromista";
import { useIsAuthenticatedStore } from "frontend/hooks/auth/useAuthenticateUser";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Lock, LogOut, User, Settings } from "react-feather";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";
import { PORTAL_ACCOUNT_MENU } from "./portal";

interface IProps {
  children: ReactNode;
}

export function BaseAccountLayout({ children }: IProps) {
  const router = useRouter();
  const setIsAuthenticated = useIsAuthenticatedStore(
    (store) => store.setIsAuthenticated
  );

  return (
    <AppLayout>
      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[
              ...PORTAL_ACCOUNT_MENU,
              {
                action: NAVIGATION_LINKS.ACCOUNT.PROFILE,
                name: "Profile",
                IconComponent: User,
                order: 10,
              },
              {
                action: NAVIGATION_LINKS.ACCOUNT.PREFERENCES,
                name: "Preferences",
                IconComponent: Settings,
                order: 20,
              },
              {
                action: NAVIGATION_LINKS.ACCOUNT.PASSWORD,
                name: "Password",
                IconComponent: Lock,
                order: 30,
              },
              {
                action: () => {
                  setIsAuthenticated(false);
                },
                name: "Log Out",
                IconComponent: LogOut,
                order: 40,
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
