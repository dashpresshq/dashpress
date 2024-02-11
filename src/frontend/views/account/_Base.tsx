import { useRouter } from "next/router";
import { ReactNode } from "react";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import {
  IMenuSectionItem,
  MenuSection,
} from "frontend/design-system/components/Section/MenuSection";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { AuthActions } from "frontend/hooks/auth/auth.actions";
import { usePortalAccountMenu } from "./portal";

interface IProps {
  children: ReactNode;
}

export function BaseAccountLayout({ children }: IProps) {
  const router = useRouter();
  const portalAccountMenu = usePortalAccountMenu();

  const baseMenuItems: IMenuSectionItem[] = [
    {
      action: NAVIGATION_LINKS.ACCOUNT.PROFILE,
      name: "Profile",
      systemIcon: "User",
      order: 10,
    },
    {
      action: NAVIGATION_LINKS.ACCOUNT.PREFERENCES,
      name: "Preferences",
      systemIcon: "Settings" as const,
      order: 20,
    },
    {
      action: NAVIGATION_LINKS.ACCOUNT.PASSWORD,
      name: "Password",
      systemIcon: "Lock",
      order: 30,
    },
    {
      action: () => {
        AuthActions.signOut("logout");
      },
      name: "Log Out",
      systemIcon: "LogOut",
      order: 40,
    },
  ];

  return (
    <AppLayout>
      <ContentLayout>
        <ContentLayout.Left>
          <MenuSection
            menuItems={[...portalAccountMenu, ...baseMenuItems]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
