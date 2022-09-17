import { ComponentIsLoading, OffCanvas } from "@hadmean/chromista";
import styled from "styled-components";
import { Check, Plus } from "react-feather";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import arrayMove from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import { useState } from "react";
import { useRouter } from "next/router";
import { AppLayout } from "../../_layouts/app";
import { DashboardWidget } from "./widgets";
import {
  useArrangeDashboardWidgetMutation,
  useDashboardWidgets,
  useDeleteDashboardWidgetMutation,
} from "./dashboard.store";
import { gridRoot } from "./styles";
import { DashboardSettings } from "./settings";

const Root = styled.div`
  .list {
    ${gridRoot};
  }
`;

const NEW_DASHBOARD_ITEM = "__new_dashboard_item__";

// codesandbox.io/s/react-easy-sort-custom-knob-demo-ij37h?file=/src/styles.css

export function ManageDashboard() {
  const router = useRouter();

  const widgets = useDashboardWidgets();

  const deleteDashboardWidgetMutation = useDeleteDashboardWidgetMutation();
  const arrangeDashboardWidgetMutation = useArrangeDashboardWidgetMutation();

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const newOrder = arrayMove(widgets.data || [], oldIndex, newIndex);
    arrangeDashboardWidgetMutation.mutate(newOrder.map(({ id }) => id));
  };

  useSetPageDetails({
    pageTitle: "Manage Dashboard",
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
            label: "Done",
            IconComponent: Check,
            onClick: () => router.replace(NAVIGATION_LINKS.DASHBOARD),
          },
        ]}
        actionItems={[
          {
            label: "New Dashboard Item",
            IconComponent: Plus,
            onClick: () => setCurrentDashboardItem(NEW_DASHBOARD_ITEM),
          },
        ]}
      >
        <ViewStateMachine
          loading={widgets.isLoading}
          error={widgets.error}
          loader={<ComponentIsLoading />}
        >
          <Root>
            <SortableList
              onSortEnd={onSortEnd}
              className="list"
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
            : currentDashboardItem
        }
        onClose={closeDashboardItem}
        show={!!currentDashboardItem}
      >
        <DashboardSettings />
        {currentDashboardItem}
      </OffCanvas>
    </>
  );
}
