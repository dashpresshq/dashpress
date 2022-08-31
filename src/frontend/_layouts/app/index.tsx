import {
  Breadcrumbs,
  ComponentIsLoading,
  DropDownMenu,
  DynamicLayout,
  Spacer,
  Stack,
  Text,
} from "@hadmean/chromista";
import React, { ReactNode, useEffect } from "react";
import { Icon } from "react-feather";
import Head from "next/head";
import { AuthService } from "@hadmean/protozoa";
import { useRouter } from "next/router";
import { useNavigationStack } from "frontend/lib/routing";
import { usePageDetailsStore } from "frontend/lib/routing/usePageDetails";
import { usePageRequiresPermission } from "frontend/hooks/auth/user.store";
import { useUserAuthenticatedState } from "frontend/hooks/auth/useAuthenticateUser";
import noop from "lodash/noop";
import { useSiteConfig } from "../../hooks/app/site.config";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { useSelectionViews } from "./useSelectionViews";

interface IProps {
  children: ReactNode;
  actionItems?: {
    label: string;
    onClick: () => void;
    IconComponent: Icon;
  }[];
}

const useUserAuthCheck = () => {
  const userAuthenticatedState = useUserAuthenticatedState();
  const router = useRouter();

  useEffect(() => {
    if (userAuthenticatedState === false) {
      AuthService.removeAuthToken();
      router.replace(NAVIGATION_LINKS.AUTH_SIGNIN);
    }
  }, [userAuthenticatedState]);

  return userAuthenticatedState;
};

export function AppLayout({ children, actionItems = [] }: IProps) {
  const siteConfig = useSiteConfig();
  const userAuthenticatedState = useUserAuthCheck();
  const { history, pushToStack, goToLinkIndex } = useNavigationStack();
  const router = useRouter();
  const [pageTitle, permission] = usePageDetailsStore((store) => [
    store.pageTitle,
    store.permission,
  ]);
  const selectionViews = useSelectionViews();

  usePageRequiresPermission(permission);

  useEffect(() => {
    pushToStack();
  }, [router.asPath]);

  noop(history);
  // const homedBreadcrumb = history.map((historyItem) => ({
  //   value: historyItem.link,
  //   label: historyItem.title,
  // }));

  const homedBreadcrumb = [];

  homedBreadcrumb.push({ value: "", label: pageTitle });

  if (userAuthenticatedState !== true) {
    return <ComponentIsLoading />;
  }

  return (
    <DynamicLayout selectionView={selectionViews}>
      <Head>
        <title>
          {pageTitle} - {siteConfig.name}
        </title>
      </Head>
      <Stack justify="space-between" align="center">
        <div>
          <Text>{pageTitle}</Text>
          <Breadcrumbs items={homedBreadcrumb} onCrumbClick={goToLinkIndex} />
        </div>
        {actionItems.length > 0 ? (
          <DropDownMenu menuItems={actionItems} />
        ) : null}
      </Stack>
      <Spacer />
      {children}
    </DynamicLayout>
  );
}
