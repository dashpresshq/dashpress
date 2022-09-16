import {
  ComponentIsLoading,
  Spacer,
  OffCanvas,
  FormNoValueSelect,
} from "@hadmean/chromista";
import styled from "styled-components";
import { Check, Plus, Settings } from "react-feather";
import { useSetPageDetails } from "frontend/lib/routing";
import { IWidgetConfig, USER_PERMISSIONS } from "shared/types";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import arrayMove from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import { useEffect, useState } from "react";
import { AppLayout } from "../../_layouts/app";
import { SummaryCard } from "./cards/SummaryCard";
import { useDashboardWidgets } from "./dashboard.store";

const Root = styled.div`
  .list {
    user-select: none;
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-gap: 16px;
  }
  .item {
    cursor: grab;
    user-select: none;
  }
`;

const NEW_DASHBOARD_ITEM = "__new_dashboard_item__";

// codesandbox.io/s/react-easy-sort-custom-knob-demo-ij37h?file=/src/styles.css

export function Dashboard() {
  const widgets = useDashboardWidgets();

  const [managingDashboard, setManagingDashboard] = useState(false);

  const [items, setItems] = useState<IWidgetConfig[]>([]);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setItems((array) => arrayMove(array, oldIndex, newIndex));
  };

  useEffect(() => {
    setItems(widgets.data || []);
  }, [JSON.stringify(widgets.data || [])]);

  useSetPageDetails({
    pageTitle: "Home",
    viewKey: "HOME",
    permission: USER_PERMISSIONS.CAN_MANAGE_DASHBOARD,
  });

  const toggleManagingState = () => {
    setManagingDashboard(!managingDashboard);
  };

  const [currentDashboardItem, setCurrentDashboardItem] = useState("");

  const closeDashboardItem = () => {
    setCurrentDashboardItem("");
  };

  return (
    <>
      <AppLayout
        secondaryActionItems={[
          {
            label: managingDashboard ? " Done " : "Manage Dashboard",
            IconComponent: managingDashboard ? Check : Settings,
            onClick: toggleManagingState,
          },
        ]}
        actionItems={
          managingDashboard
            ? [
                {
                  label: "New Dashboard Item",
                  IconComponent: Plus,
                  onClick: () => setCurrentDashboardItem(NEW_DASHBOARD_ITEM),
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
          <Root>
            <SortableList
              onSortEnd={onSortEnd}
              className="list"
              draggedItemClassName="dragged"
            >
              {items.map((config) => (
                <SortableItem key={config.id}>
                  <div className="item">
                    <SummaryCard config={config} />
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
