import { Settings } from "react-feather";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import React from "react";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import styled from "styled-components";
import { useRouter } from "next/router";

import { AppLayout } from "../../../_layouts/app";
import { useDashboardWidgets } from "../dashboard.store";
import { gridRoot } from "../styles";
import { DemoVideo } from "./Demo";
import { DashboardSkeleton } from "../Skeleton";
import { DetailsCanvas } from "../../data/Table/DetailsCanvas";
import { DashboardWidget } from "../Widget";

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

  const userHasPermission = useUserHasPermission();

  return (
    <AppLayout
      actionItems={
        userHasPermission(USER_PERMISSIONS.CAN_MANAGE_DASHBOARD)
          ? [
              {
                id: "manage-dashboard",
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
          {widgets.data.map((config) => (
            <DashboardWidget config={config} key={config.id} />
          ))}
        </Root>
      </ViewStateMachine>
      <DetailsCanvas />
    </AppLayout>
  );
}
