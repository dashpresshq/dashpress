import { Filter, Settings } from "react-feather";
import { USER_PERMISSIONS } from "shared/types/user";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import React from "react";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import styled from "styled-components";
import { useRouter } from "next/router";

import { AppLayout } from "../../_layouts/app";
import { useDashboardWidgets } from "./dashboard.store";
import { gridRoot } from "./styles";
import { DashboardWidget } from "./widgets";
import { DemoVideo } from "./Demo";
import { useDashboardRelativeDayStore } from "./relativeTime.store";
import { DASHBOARD_RELATIVE_DAYS } from "./constants";
import { DashboardSkeleton } from "./Skeleton";

const Root = styled.div`
  ${gridRoot};
`;

interface IProps {
  dashboardId: string;
  showDemo?: true;
  manageLink: string;
}

export function BaseDashboard({ dashboardId, showDemo, manageLink }: IProps) {
  const widgets = useDashboardWidgets(dashboardId);
  const router = useRouter();

  const setCurrentRelativeDay = useDashboardRelativeDayStore(
    (store) => store.setCurrentRelativeDay
  );

  const canManageDashboard = useUserHasPermission(
    USER_PERMISSIONS.CAN_MANAGE_DASHBOARD
  );

  return (
    <AppLayout
      actionItems={DASHBOARD_RELATIVE_DAYS.map(({ label, value }) => ({
        label: `Past ${label}`,
        onClick: () => {
          setCurrentRelativeDay(value);
        },
        IconComponent: Filter,
      }))}
      secondaryActionItems={
        canManageDashboard === true
          ? [
              {
                label: "Manage Dashboard",
                IconComponent: Settings,
                onClick: () => router.replace(manageLink),
              },
            ]
          : []
      }
    >
      {showDemo && <DemoVideo />}
      <ViewStateMachine
        loading={widgets.isLoading}
        error={widgets.error}
        loader={<DashboardSkeleton />}
      >
        <Root>
          {/* TODO Filter out the entites that the user can see */}
          {(widgets.data || []).map((config) => (
            <DashboardWidget config={config} key={config.id} />
          ))}
        </Root>
      </ViewStateMachine>
    </AppLayout>
  );
}
