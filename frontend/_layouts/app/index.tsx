import {
  Breadcrumbs,
  ComponentIsLoading,
  DropDownMenu,
  DynamicLayout,
  Spacer,
  Stack,
  Text,
} from "@gothicgeeks/design-system";
import { IValueLabel } from "@gothicgeeks/design-system/dist/types";
import React, { ReactNode, useEffect, useState } from "react";
import { Icon, Settings, Home, Table, BarChart } from "react-feather";
import Head from "next/head";
import { AuthService } from "@gothicgeeks/shared";
import { useRouter } from "next/router";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";
import { useSiteConfig } from "../../hooks/app/site.config";
import { NAVIGATION_LINKS } from "../../lib/routing/links";

interface IProps {
  children: ReactNode;
  breadcrumbs: IValueLabel[];
  titleNeedsContext?: true;
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
        router.replace(NAVIGATION_LINKS.SIGN);
        return;
      }
      // TODO isCreator check
      setIsChecking(false);
    }
  }, [typeof window]);

  return isChecking;
};

export function AppLayout({
  children,
  breadcrumbs,
  titleNeedsContext,
  actionItems = [],
}: IProps) {
  const entitiesMenuItems = useEntitiesMenuItems();
  const siteConfig = useSiteConfig();
  const isChecking = useUserAuthCheck();
  const homedBreadcrumb = [{ label: "Home", value: "/" }, ...breadcrumbs];

  const title =
    (titleNeedsContext
      ? `${homedBreadcrumb[homedBreadcrumb.length - 2]?.label} - `
      : "") + (homedBreadcrumb[homedBreadcrumb.length - 1]?.label || "");

  if (isChecking) {
    return <ComponentIsLoading />;
  }

  return (
    <DynamicLayout
      selectionView={[
        {
          title: "Home",
          icon: Home,
          link: NAVIGATION_LINKS.DASHBOARD,
        },
        {
          title: "Tables",
          description: "Your models",
          icon: Table,
          viewMenuItems: {
            ...entitiesMenuItems,
            data: (entitiesMenuItems.data || []).map(({ label, value }) => ({
              title: label,
              link: NAVIGATION_LINKS.ENTITY.TABLE(value),
            })),
          },
        },
        {
          title: "Dashboards",
          description: "Your models",
          icon: BarChart,
          view: <>Demo View</>,
        },
        {
          title: "Settings",
          icon: Settings,
          link: NAVIGATION_LINKS.SETTINGS.DEFAULT,
        },
      ]}
    >
      <Head>
        <title>
          {title} - {siteConfig.name}
        </title>
      </Head>
      <Stack justify="space-between" align="center">
        <div>
          <Text>{title}</Text>
          <Breadcrumbs items={homedBreadcrumb} />
        </div>
        {/* Remove this logic on version update */}
        {actionItems.length > 0 && <DropDownMenu menuItems={actionItems} />}
      </Stack>
      <Spacer />
      {children}
    </DynamicLayout>
  );
}
