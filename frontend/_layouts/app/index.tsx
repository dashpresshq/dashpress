import {
  Breadcrumbs,
  ComponentIsLoading,
  DropDownMenu,
  DynamicLayout,
  Spacer,
  Stack,
  Text,
} from "@gothicgeeks/design-system";
import React, { ReactNode, useEffect, useState } from "react";
import { Icon } from "react-feather";
import Head from "next/head";
import { AuthService } from "@gothicgeeks/shared";
import { useRouter } from "next/router";
import { useNavigationStack } from "frontend/lib/routing";
import { usePageTitleStore } from "frontend/lib/routing/usePageTItle";
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
      // TODO isCreator check
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
  const pageTitle = usePageTitleStore((store) => store.pageTitle);
  const selectionViews = useSelectionViews();

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
        {/* Remove this logic on version update */}
        {actionItems.length > 0 && <DropDownMenu menuItems={actionItems} />}
      </Stack>
      <Spacer />
      {children}
    </DynamicLayout>
  );
}
