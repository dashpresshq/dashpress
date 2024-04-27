import { useEntitiesFilterCount } from "frontend/hooks/data/data.store";
import { FieldQueryFilter } from "shared/types/data";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { abbreviateNumber } from "frontend/lib/numbers";
import { TableSkeleton } from "frontend/design-system/components/Skeleton/Table";
import { Card } from "frontend/design-system/components/Card";
import { Tabs } from "frontend/design-system/components/Tabs";
import { msg } from "@lingui/macro";
import { i18nNoop } from "shared/lib/noop";
import { DetailsCanvas } from "./DetailsCanvas";
import { TableTopComponent, usePortalTableTabs } from "../portal";
import { EntityDataTable } from "./EntityDataTable";

interface IProps {
  entity: string;
  persistentFilters?: FieldQueryFilter[];
  skipColumns?: string[];
  createNewLink: string;
}

export function WholeEntityTable({
  entity,
  persistentFilters = [],
  skipColumns,
  createNewLink,
}: IProps) {
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");
  const portalTableTabs = usePortalTableTabs(entity);
  const tableViews = useEntityConfiguration("table_views", entity);

  const tableTabs = [...tableViews.data, ...portalTableTabs.data];

  const tableViewsCount = useEntitiesFilterCount(
    tableTabs.length === 0
      ? []
      : tableTabs.map(({ id, dataState }) => ({
          entity,
          id,
          filters: [
            ...(dataState.filters as FieldQueryFilter[]),
            ...persistentFilters,
          ],
        }))
  );

  const dataTableProps = {
    entity,
    persistentFilters,
    skipColumns,
    createNewLink,
  };

  return (
    <>
      <TableTopComponent entity={entity} />
      <Card>
        <ViewStateMachine
          error={tableViews.error || portalTableTabs.error}
          loading={tableViews.isLoading || portalTableTabs.isLoading}
          loader={<TableSkeleton />}
        >
          {tableTabs.length > 0 ? (
            <Tabs
              padContent={false}
              lazy
              currentTab={tabFromUrl}
              onChange={changeTabParam}
              contents={tableTabs.map(({ title, dataState, id }) => {
                const currentViewSlice = tableViewsCount.data[id];

                const currentCount = currentViewSlice.isLoading
                  ? "..."
                  : abbreviateNumber(currentViewSlice?.data?.count || 0);

                return {
                  content: (
                    <EntityDataTable
                      {...{ ...dataTableProps }}
                      tabKey={title}
                      defaultTableState={dataState}
                    />
                  ),
                  id: title.trim(),
                  label: msg`${i18nNoop(title)}(${i18nNoop(currentCount)})`,
                };
              })}
            />
          ) : (
            <EntityDataTable {...{ ...dataTableProps }} />
          )}
        </ViewStateMachine>
      </Card>
      <DetailsCanvas />
    </>
  );
}
