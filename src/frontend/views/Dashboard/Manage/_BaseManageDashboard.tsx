import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useRouter } from "next/router";
import SortableList, { SortableItem } from "react-easy-sort";

import { ViewStateMachine } from "@/components/app/view-state-machine";
import { AppLayout } from "@/frontend/_layouts/app";
import { useDomainMessages } from "@/frontend/lib/crud-config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";
import { NAVIGATION_LINKS } from "@/frontend/lib/routing/links";
import { useSetPageDetails } from "@/frontend/lib/routing/usePageDetails";
import { UserPermissions } from "@/shared/constants/user";
import { arrayMoveImmutable } from "@/shared/lib/array/move";

import {
  useArrangeDashboardWidgetMutation,
  useDashboardWidgets,
  useDeleteDashboardWidgetMutation,
} from "../dashboard.store";
import { DashboardSkeleton } from "../Skeleton";
import { DashboardWidget } from "../Widget";

interface IProps {
  dashboardId: string;
  doneLink: string;
  title: string;
}

export function BaseManageDashboard({ dashboardId, doneLink, title }: IProps) {
  const router = useRouter();

  const { _ } = useLingui();

  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);

  const widgets = useDashboardWidgets(dashboardId);

  const deleteDashboardWidgetMutation =
    useDeleteDashboardWidgetMutation(dashboardId);
  const arrangeDashboardWidgetMutation =
    useArrangeDashboardWidgetMutation(dashboardId);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const newOrder = arrayMoveImmutable(widgets.data, oldIndex, newIndex);
    arrangeDashboardWidgetMutation.mutate(newOrder.map(({ id }) => id));
  };

  useSetPageDetails({
    pageTitle: msg`Manage ${title}`,
    viewKey: "MANAGE_DASHBOARD",
    permission: UserPermissions.CAN_MANAGE_DASHBOARD,
  });

  return (
    <AppLayout
      secondaryActionItems={[
        {
          id: "done",
          label: msg`Done`,
          systemIcon: "Check",
          action: () => router.replace(doneLink),
        },
      ]}
      actionItems={[
        {
          id: "new",
          label: domainMessages.TEXT_LANG.CREATE,
          systemIcon: "Plus",
          action: NAVIGATION_LINKS.DASHBOARD.WIDGET.CREATE(dashboardId),
        },
      ]}
    >
      <div className="@container">
        <ViewStateMachine
          loading={widgets.isLoading}
          error={widgets.error}
          loader={<DashboardSkeleton />}
        >
          <SortableList
            onSortEnd={onSortEnd}
            className="dashboard-grid-root"
            aria-label={_(domainMessages.TEXT_LANG.TITLE)}
            draggedItemClassName="dragged"
          >
            {widgets.data.map((config) => (
              <SortableItem key={config.id}>
                <DashboardWidget
                  config={config}
                  setting={{
                    delete: () =>
                      deleteDashboardWidgetMutation.mutate(config.id),
                    setId: () => {
                      router.push(
                        NAVIGATION_LINKS.DASHBOARD.WIDGET.UPDATE(
                          dashboardId,
                          config.id
                        )
                      );
                    },
                  }}
                />
              </SortableItem>
            ))}
          </SortableList>
        </ViewStateMachine>
      </div>
    </AppLayout>
  );
}
