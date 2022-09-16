import { ComponentIsLoading, Spacer } from "@hadmean/chromista";
import { Settings } from "react-feather";
import { useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS, USER_PERMISSIONS } from "shared/types";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import React from "react";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { AppLayout } from "../../_layouts/app";
import { SummaryCard } from "./cards/SummaryCard";
import { useDashboardWidgets } from "./dashboard.store";

export function Dashboard() {
  const widgets = useDashboardWidgets();

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
                onClick: () => {},
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
        {(widgets.data || []).map((config) => (
          <React.Fragment key={config.id}>
            <SummaryCard config={config} />
            <Spacer size="xl" />
          </React.Fragment>
        ))}
      </ViewStateMachine>
    </AppLayout>
  );
}
