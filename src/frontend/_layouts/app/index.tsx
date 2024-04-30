import { ReactNode, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { usePageDetailsStore } from "frontend/lib/routing/usePageDetails";
import { usePageRequiresPermission } from "frontend/hooks/auth/user.store";
import {
  DropDownMenu,
  IDropDownMenuItem,
} from "frontend/design-system/components/DropdownMenu";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Breadcrumbs } from "frontend/design-system/components/Breadcrumbs";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import styled from "styled-components";
import { useLingui } from "@lingui/react";
import { DEMO_LINKS } from "./constant";

const HeaderLeft = styled.div`
  text-align: left;
`;

export interface IProps {
  children: ReactNode;
  actionItems?: IDropDownMenuItem[];
  secondaryActionItems?: IDropDownMenuItem[];
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
          {_(pageTitle)} - {siteConfig.data.name}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Stack $justify="space-between" $align="center">
        <HeaderLeft>
          <Typo.MD>{_(pageTitle)}</Typo.MD>
          <Breadcrumbs items={homedBreadcrumb} onCrumbClick={goToLinkIndex} />
        </HeaderLeft>
        <div>
          <Stack>
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
                menuItems={DEMO_LINKS.map((link) => ({
                  ...link,
                  action: () => window.open(link.link),
                }))}
              />
            )}
          </Stack>
        </div>
      </Stack>
      <Spacer />
      <main>{children}</main>
    </>
  );
}
