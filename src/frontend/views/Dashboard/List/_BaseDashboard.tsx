import { Edit } from "react-feather";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import React from "react";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import styled from "styled-components";
import { useRouter } from "next/router";
import { AppLayout } from "frontend/_layouts/app";
import { useDashboardWidgets } from "../dashboard.store";
import { dashboardGridRoot } from "../styles";
import { DashboardSkeleton } from "../Skeleton";
import { DashboardWidget } from "../Widget";

const Root = styled.div`
  ${dashboardGridRoot};
`;

interface IProps {
  dashboardId: string;
  manageLink: string;
}

export function BaseDashboard({ dashboardId, manageLink }: IProps) {
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
                label: "Edit Dashboard",
                IconComponent: Edit,
                onClick: () => router.replace(manageLink),
              },
            ]
          : []
      }
    >
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
    </AppLayout>
  );
}
