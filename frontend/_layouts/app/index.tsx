import {
  Breadcrumbs,
  ComponentIsLoading,
  DropDownMenu,
  DynamicLayout,
  Spacer,
  Stack,
  Text,
} from "@adminator/chromista";
import React, { ReactNode, useEffect, useState } from "react";
import { Icon } from "react-feather";
import Head from "next/head";
import { AuthService } from "@adminator/protozoa";
import { useRouter } from "next/router";
import { useNavigationStack } from "frontend/lib/routing";
import { usePageDetailsStore } from "frontend/lib/routing/usePageDetails";
import { usePageRequiresPermission } from "frontend/hooks/auth/user.store";
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
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!AuthService.isAuthenticated()) {
        //  TODO router.replace(`${NAVIGATION_LINKS.AUTH_SIGNIN}?next=${router.asPath}`);
        router.replace(NAVIGATION_LINKS.AUTH_SIGNIN);
        return;
      }
      setIsChecking(false);
    }
  }, [typeof window]);

  return isChecking;
};

export function AppLayout({ children, actionItems = [] }: IProps) {
  const siteConfig = useSiteConfig();
  const isChecking = useUserAuthCheck();
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

  const homedBreadcrumb = history.map((historyItem) => ({
    value: historyItem.link,
    label: historyItem.title,
  }));

  homedBreadcrumb.push({ value: "", label: pageTitle });

  if (isChecking) {
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
        <DropDownMenu menuItems={actionItems} />
      </Stack>
      <Spacer />
      {children}
    </DynamicLayout>
  );
}
