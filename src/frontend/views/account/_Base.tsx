import { msg } from "@lingui/macro";
import { AppLayout } from "frontend/_layouts/app";
import { AuthActions } from "frontend/hooks/auth/auth.actions";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import type { ReactNode } from "react";

import type { IMenuActionItem } from "@/components/app/button/types";
import { ContentLayout } from "@/components/app/content-layout";
import { MenuSection } from "@/components/app/menu-section";

import { usePortalAccountMenu } from "./portal";

interface IProps {
  children: ReactNode;
}

export function BaseAccountLayout({ children }: IProps) {
  const portalAccountMenu = usePortalAccountMenu();

  const baseMenuItems: IMenuActionItem[] = [
    {
      id: "profile",
      action: NAVIGATION_LINKS.ACCOUNT.PROFILE,
      label: msg`Profile`,
      systemIcon: "User",
      order: 10,
    },
    {
      id: "preferences",
      action: NAVIGATION_LINKS.ACCOUNT.PREFERENCES,
      label: msg`Preferences`,
      systemIcon: "Settings" as const,
      order: 20,
    },
    {
      id: "password",
      action: NAVIGATION_LINKS.ACCOUNT.PASSWORD,
      label: msg`Password`,
      systemIcon: "Lock",
      order: 30,
    },
    {
      id: "logout",
      action: () => {
        AuthActions.signOut();
      },
      label: msg`Log Out`,
      systemIcon: "LogOut",
      destructive: true,
      order: 40,
    },
  ];

  return (
    <AppLayout>
      <ContentLayout>
        <ContentLayout.Left>
          <MenuSection menuItems={[...portalAccountMenu, ...baseMenuItems]} />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
