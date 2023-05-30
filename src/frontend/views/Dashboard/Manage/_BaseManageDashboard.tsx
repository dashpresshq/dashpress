import styled from "styled-components";
import { Check, Plus } from "react-feather";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import arrayMove from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import { useRouter } from "next/router";
import { AppLayout } from "../../../_layouts/app";
import {
  useArrangeDashboardWidgetMutation,
  useDashboardWidgets,
  useDeleteDashboardWidgetMutation,
} from "../dashboard.store";
import { gridRoot } from "../styles";
import { DashboardSkeleton } from "../Skeleton";
import { DashboardWidget } from "../Widget";
import { DASHBOARD_WIDGETS_CRUD_CONFIG } from "../constants";

const Root = styled.div`
  .list {
    ${gridRoot};
  }
`;

interface IProps {
  dashboardId: string;
  doneLink: string;
  title: string;
}

export function BaseManageDashboard({ dashboardId, doneLink, title }: IProps) {
  const router = useRouter();

  const widgets = useDashboardWidgets(dashboardId);

  const deleteDashboardWidgetMutation =
    useDeleteDashboardWidgetMutation(dashboardId);
  const arrangeDashboardWidgetMutation =
    useArrangeDashboardWidgetMutation(dashboardId);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const newOrder = arrayMove(widgets.data, oldIndex, newIndex);
    arrangeDashboardWidgetMutation.mutate(newOrder.map(({ id }) => id));
  };

  useSetPageDetails({
    pageTitle: `Manage ${title}`,
    viewKey: "MANAGE_DASHBOARD",
    permission: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
  });

  return (
    <AppLayout
      secondaryActionItems={[
        {
          id: "done",
          label: "Done",
          IconComponent: Check,
          onClick: () => router.replace(doneLink),
        },
      ]}
      actionItems={[
        {
          id: "new",
          label: DASHBOARD_WIDGETS_CRUD_CONFIG.TEXT_LANG.CREATE,
          IconComponent: Plus,
          onClick: () =>
            router.push(NAVIGATION_LINKS.DASHBOARD.WIDGET.CREATE(dashboardId)),
        },
      ]}
    >
      <ViewStateMachine
        loading={widgets.isLoading}
        error={widgets.error}
        loader={<DashboardSkeleton />}
      >
        <Root>
          <SortableList
            onSortEnd={onSortEnd}
            className="list"
            aria-label={DASHBOARD_WIDGETS_CRUD_CONFIG.TEXT_LANG.TITLE}
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
        </Root>
      </ViewStateMachine>
    </AppLayout>
  );
}
