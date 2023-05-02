import {
  FormSkeleton,
  FormSkeletonSchema,
  OffCanvas,
} from "@hadmean/chromista";
import styled from "styled-components";
import { Check, Plus } from "react-feather";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import arrayMove from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import { useState } from "react";
import { useRouter } from "next/router";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { nanoid } from "nanoid";
import { SystemIconsList } from "shared/constants/Icons";
import { AppLayout } from "../../../_layouts/app";
import {
  useArrangeDashboardWidgetMutation,
  useCreateDashboardWidgetMutation,
  useDashboardWidgets,
  useDeleteDashboardWidgetMutation,
  useUpdateDashboardWidgetMutation,
} from "../dashboard.store";
import { gridRoot } from "../styles";
import { DashboardSkeleton } from "../Skeleton";
import { DetailsCanvas } from "../../data/Table/DetailsCanvas";
import { DashboardWidget } from "../Widget";
import { DashboardWidgetForm } from "../Widget/_manage/Form";

const Root = styled.div`
  .list {
    ${gridRoot};
  }
`;

const NEW_DASHBOARD_ITEM = "__new_dashboard_item__";

interface IProps {
  dashboardId: string;
  doneLink: string;
  title: string;
}

export function BaseManageDashboard({ dashboardId, doneLink, title }: IProps) {
  const router = useRouter();

  const widgets = useDashboardWidgets(dashboardId);

  const activeEntities = useActiveEntities();

  const deleteDashboardWidgetMutation =
    useDeleteDashboardWidgetMutation(dashboardId);
  const arrangeDashboardWidgetMutation =
    useArrangeDashboardWidgetMutation(dashboardId);
  const createDashboardWidgetMutation =
    useCreateDashboardWidgetMutation(dashboardId);
  const updateDashboardWidgetMutation =
    useUpdateDashboardWidgetMutation(dashboardId);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const newOrder = arrayMove(widgets.data || [], oldIndex, newIndex);
    arrangeDashboardWidgetMutation.mutate(newOrder.map(({ id }) => id));
  };

  useSetPageDetails({
    pageTitle: `Manage ${title}`,
    viewKey: "MANAGE_DASHBOARD",
    permission: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
  });

  const [currentDashboardItem, setCurrentDashboardItem] = useState("");

  const closeDashboardItem = () => {
    setCurrentDashboardItem("");
  };

  return (
    <>
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
            label: "New Dashboard Item",
            IconComponent: Plus,
            onClick: () => setCurrentDashboardItem(NEW_DASHBOARD_ITEM),
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
              aria-label="Dashboard Widgets"
              draggedItemClassName="dragged"
            >
              {(widgets.data || []).map((config) => (
                <SortableItem key={config.id}>
                  <DashboardWidget
                    config={config}
                    setting={{
                      delete: () =>
                        deleteDashboardWidgetMutation.mutate(config.id),
                      setId: () => {
                        setCurrentDashboardItem(config.id);
                      },
                    }}
                  />
                </SortableItem>
              ))}
            </SortableList>
          </Root>
        </ViewStateMachine>
      </AppLayout>
      <OffCanvas
        title={
          currentDashboardItem === NEW_DASHBOARD_ITEM
            ? "New Dashboard Item"
            : "Edit Dashboard Item"
        }
        onClose={closeDashboardItem}
        show={!!currentDashboardItem}
      >
        <ViewStateMachine
          loading={activeEntities.isLoading}
          error={activeEntities.error}
          loader={
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
              ]}
            />
          }
        >
          <DashboardWidgetForm
            entities={activeEntities.data}
            onSubmit={async (config) => {
              if (currentDashboardItem === NEW_DASHBOARD_ITEM) {
                createDashboardWidgetMutation.mutate({
                  ...config,
                  id: nanoid(),
                });
              } else {
                updateDashboardWidgetMutation.mutate(config);
              }
              closeDashboardItem();
            }}
            initialValues={
              (widgets.data || []).find(
                ({ id }) => id === currentDashboardItem
              ) || { icon: SystemIconsList[0] }
            }
          />
        </ViewStateMachine>
      </OffCanvas>
      <DetailsCanvas />
    </>
  );
}
