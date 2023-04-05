import {
  Breadcrumbs,
  DropDownMenu,
  IDropDownMenuItem,
  Spacer,
  Stack,
  Typo,
} from "@hadmean/chromista";
import React, { ReactNode, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useNavigationStack } from "frontend/lib/routing";
import { usePageDetailsStore } from "frontend/lib/routing/usePageDetails";
import { usePageRequiresPermission } from "frontend/hooks/auth/user.store";
import { GitHub, Globe, Twitter, Users } from "react-feather";
import { useSiteConfig } from "../../hooks/app/site.config";
import { GoogleTagManager } from "../scripts/GoogleTagManager";

export { IsSignedIn } from "./IsSignedIn";

export interface IBaseLayoutProps {
  children: ReactNode;
  actionItems?: IDropDownMenuItem[];
  secondaryActionItems?: IDropDownMenuItem[];
}

export function BaseLayout({
  children,
  actionItems = [],
  secondaryActionItems = [],
}: IBaseLayoutProps) {
  const siteConfig = useSiteConfig();
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

  usePageRequiresPermission(permission);

  useEffect(() => {
    pushToStack();
  }, [router.asPath, pageTitle]);

  const homedBreadcrumb = history.map((historyItem) => ({
    value: historyItem.link,
    label: historyItem.title,
  }));

  const actionMenuItems = [...actionItems, ...pageActionItems];
  const secondaryMenuItems = [
    ...secondaryActionItems,
    ...pageSecondaryActionItems,
  ];

  // Interfering with the tests
  // if (isLoading) {
  //   return <ComponentIsLoading />;
  // }

  return (
    <>
      <Head>
        <title>
          {pageTitle} - {siteConfig.name}
        </title>
      </Head>
      <Stack justify="space-between" align="center">
        <div>
          <Typo.MD>{pageTitle}</Typo.MD>
          <Breadcrumbs items={homedBreadcrumb} onCrumbClick={goToLinkIndex} />
        </div>
        <div>
          <Stack>
            {actionMenuItems.length > 0 ? (
              <DropDownMenu menuItems={actionMenuItems} />
            ) : null}
            {secondaryMenuItems.length > 0 ? (
              <DropDownMenu menuItems={secondaryMenuItems} />
            ) : null}
            {process.env.NEXT_PUBLIC_IS_DEMO && (
              <DropDownMenu
                menuItems={[
                  {
                    id: "github",
                    IconComponent: GitHub,
                    label: "Star us on Github",
                    description: `Tell us Hadmean is a useful project by dropping us a star`,
                    onClick: () => {
                      window.open("https://github.com/hadmean/hadmean");
                    },
                  },
                  {
                    id: "twitter",
                    IconComponent: Twitter,
                    label: "Follow us on Twitter",
                    description: `Tweet at @hadmeanHQ if you know others will benefit using Hadmean`,
                    onClick: () => {
                      window.open("https://twitter.com/hadmeanHQ");
                    },
                  },
                  {
                    id: "users",
                    IconComponent: Users,
                    label: "Join our Discord community",
                    description: `Ask your questions here`,
                    onClick: () => {
                      window.open("https://discord.gg/aV6DxwXhzN");
                    },
                  },
                  {
                    id: "website",
                    IconComponent: Globe,
                    label: "Visit our website",
                    description: `For more links on documentation, roadmap, blog etc`,
                    onClick: () => {
                      window.open("https://hadmean.com");
                    },
                  },
                ]}
              />
            )}
          </Stack>
        </div>
      </Stack>
      <Spacer />
      <main>{children}</main>
      <GoogleTagManager />
    </>
  );
}
