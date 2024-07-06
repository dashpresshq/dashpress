import { useLingui } from "@lingui/react";
import { usePageRequiresPermission } from "frontend/hooks/auth/user.store";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { usePageDetailsStore } from "frontend/lib/routing/usePageDetails";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { Breadcrumbs } from "@/components/app/breadcrumbs";
import type { IMenuActionItem } from "@/components/app/button/types";
import { DropDownMenu } from "@/components/app/drop-drop-menu";

import { useAppTheme } from "../useAppTheme";
import { DEMO_LINKS } from "./constant";

export interface IProps {
  children: ReactNode;
  actionItems?: IMenuActionItem[];
  secondaryActionItems?: IMenuActionItem[];
}

export function AppLayout({
  children,
  actionItems = [],
  secondaryActionItems = [],
}: IProps) {
  const siteConfig = useAppConfiguration("site_settings");
  const { history, pushToStack, goToLinkIndex } = useNavigationStack();
  const router = useRouter();
  const [
    pageTitle,
    permission,
    pageActionItems = [],
    pageSecondaryActionItems = [],
  ] = usePageDetailsStore((store) => [
    store.pageTitle,
    store.permission,
    store.actionItems,
    store.secondaryActionItems,
  ]);

  useAppTheme();

  usePageRequiresPermission(permission);

  useEffect(() => {
    pushToStack();
  }, [router.asPath, pageTitle?.message]);

  const homedBreadcrumb = history.map((historyItem) => ({
    value: historyItem.link,
    label: historyItem.title,
  }));

  const actionMenuItems = [...actionItems, ...pageActionItems];
  const secondaryMenuItems = [
    ...secondaryActionItems,
    ...pageSecondaryActionItems,
  ];

  const { _ } = useLingui();

  return (
    <>
      <Head>
        <title>
          {pageTitle ? _(pageTitle) : null} - {siteConfig.data.name}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div id="gaussian-portal-0">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-left">
            <p>{pageTitle ? _(pageTitle) : null}</p>
            <Breadcrumbs items={homedBreadcrumb} onCrumbClick={goToLinkIndex} />
          </div>
          <div>
            <div className="flex gap-2">
              {actionMenuItems.length > 0 ? (
                <DropDownMenu
                  ariaLabel="Toggle Action Menu"
                  menuItems={actionMenuItems}
                />
              ) : null}
              {secondaryMenuItems.length > 0 ? (
                <DropDownMenu
                  ariaLabel="Toggle Secondary  Menu"
                  menuItems={secondaryMenuItems}
                />
              ) : null}
              {process.env.NEXT_PUBLIC_IS_DEMO && (
                <DropDownMenu
                  ariaLabel="Toggle Demo Menu"
                  menuItems={DEMO_LINKS}
                />
              )}
            </div>
          </div>
        </div>
        <main>{children}</main>
      </div>
    </>
  );
}
