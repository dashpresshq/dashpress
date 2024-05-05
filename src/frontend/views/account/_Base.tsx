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
import { msg } from "@lingui/macro";
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
      name: msg`Profile`,
      systemIcon: "User",
      order: 10,
    },
    {
      action: NAVIGATION_LINKS.ACCOUNT.PREFERENCES,
      name: msg`Preferences`,
      systemIcon: "Settings" as const,
      order: 20,
    },
    {
      action: NAVIGATION_LINKS.ACCOUNT.PASSWORD,
      name: msg`Password`,
      systemIcon: "Lock",
      order: 30,
    },
    {
      action: () => {
        AuthActions.signOut();
      },
      name: msg`Log Out`,
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
