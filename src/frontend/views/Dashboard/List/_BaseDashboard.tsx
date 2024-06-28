import { UserPermissions } from "shared/constants/user";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { useRouter } from "next/router";
import { AppLayout } from "frontend/_layouts/app";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { useDashboardWidgets } from "../dashboard.store";
import { DashboardSkeleton } from "../Skeleton";
import { DashboardWidget } from "../Widget";

interface IProps {
  dashboardId: string;
  manageLink: string;
}

export function BaseDashboard({ dashboardId, manageLink }: IProps) {
  const widgets = useDashboardWidgets(dashboardId);
  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.DASHBOARDS);

  const router = useRouter();

  const userHasPermission = useUserHasPermission();

  return (
    <AppLayout
      actionItems={
        userHasPermission(UserPermissions.CAN_MANAGE_DASHBOARD)
          ? [
              {
                id: "manage-dashboard",
                label: domainMessages.TEXT_LANG.EDIT,
                systemIcon: "Edit" as const,
                action: () => router.replace(manageLink),
              },
            ]
          : []
      }
    >
      <div className="@container">
        <ViewStateMachine
          loading={widgets.isLoading}
          error={widgets.error}
          loader={<DashboardSkeleton />}
        >
          <div className="dashboard-grid-root">
            {widgets.data.map((config) => (
              <DashboardWidget config={config} key={config.id} />
            ))}
          </div>
        </ViewStateMachine>
      </div>
    </AppLayout>
  );
}
