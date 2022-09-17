import {
  ComponentIsLoading,
  Spacer,
  OffCanvas,
  FormNoValueSelect,
} from "@hadmean/chromista";
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
import { SummaryCard } from "./cards/SummaryCard";
import {
  useArrangeDashboardWidgetMutation,
  useDashboardWidgets,
  useDeleteDashboardWidgetMutation,
} from "./dashboard.store";
import { gridRoot } from "./styles";

const Root = styled.div`
  .list {
    ${gridRoot};
  }
  .item {
    cursor: grab;
    user-select: none;
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
    pageTitle: "Manage Dashbaord",
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
                  <div className="item">
                    <SummaryCard
                      config={config}
                      setting={{
                        delete: () =>
                          deleteDashboardWidgetMutation.mutate(config.id),
                        setId: () => {
                          setCurrentDashboardItem(config.id);
                        },
                      }}
                    />
                    <Spacer size="xl" />
                  </div>
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
        <FormNoValueSelect
          disabledOptions={[]}
          selectData={[
            {
              label: "Summary Card",
              value: "Summary Card",
            },
            {
              label: "Bar Chart",
              value: "Bar Chart",
            },
            {
              label: "Line Chart",
              value: "Line Chart",
            },
            {
              label: "Pie Chart",
              value: "Pie Chart",
            },
            {
              label: "Pivot Table",
              value: "Pivot Table",
            },
            {
              label: "Table",
              value: "Table",
            },
            {
              label: "Histogram",
              value: "Histogram",
            },
          ]}
          onChange={() => {}}
        />
        {currentDashboardItem}
      </OffCanvas>
    </>
  );
}
