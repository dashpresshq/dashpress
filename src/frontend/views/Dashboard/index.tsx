import { ComponentIsLoading } from "@hadmean/chromista";
import { Settings } from "react-feather";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/types";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import React from "react";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import styled from "styled-components";
import { useRouter } from "next/router";
import { AppLayout } from "../../_layouts/app";
import { useDashboardWidgets } from "./dashboard.store";
import { gridRoot } from "./styles";
import { DashboardWidget } from "./widgets";

const Root = styled.div`
  ${gridRoot};
`;

export function Dashboard() {
  const widgets = useDashboardWidgets();
  const router = useRouter();

  useSetPageDetails({
    pageTitle: "Home",
    viewKey: "HOME",
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const canManageDashboard = useUserHasPermission(
    USER_PERMISSIONS.CAN_MANAGE_DASHBOARD
  );

  return (
    <AppLayout
      secondaryActionItems={
        canManageDashboard === true
          ? [
              {
                label: "Manage Dashboard",
                IconComponent: Settings,
                onClick: () =>
                  router.replace(NAVIGATION_LINKS.SETTINGS.DASHBOARD),
              },
            ]
          : []
      }
    >
      <ViewStateMachine
        loading={widgets.isLoading}
        error={widgets.error}
        loader={<ComponentIsLoading />}
      >
        <Root>
          {(widgets.data || []).map((config) => (
            <DashboardWidget config={config} key={config.id} />
          ))}
        </Root>
      </ViewStateMachine>
    </AppLayout>
  );
}
