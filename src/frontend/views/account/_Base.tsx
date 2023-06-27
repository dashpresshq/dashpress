import { useIsAuthenticatedStore } from "frontend/hooks/auth/useAuthenticateUser";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Lock, LogOut, User, Settings } from "react-feather";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { MenuSection } from "frontend/design-system/components/Section/MenuSection";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { usePortalAccountMenu } from "./portal";

interface IProps {
  children: ReactNode;
}

export function BaseAccountLayout({ children }: IProps) {
  const router = useRouter();
  const portalAccountMenu = usePortalAccountMenu();
  const setIsAuthenticated = useIsAuthenticatedStore(
    (store) => store.setIsAuthenticated
  );

  return (
    <AppLayout>
      <ContentLayout>
        <ContentLayout.Left>
          <MenuSection
            menuItems={[
              ...portalAccountMenu,
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
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
