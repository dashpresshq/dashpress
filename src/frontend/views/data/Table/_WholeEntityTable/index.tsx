import { useEntitiesFilterCount } from "frontend/hooks/data/data.store";
import { FieldQueryFilter } from "shared/types/data";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useChangeRouterParam } from "frontend/lib/routing/useChangeRouterParam";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { abbreviateNumber } from "frontend/lib/numbers";
import { fakeMessageDescriptor } from "translations/fake";
import { DetailsCanvas } from "./DetailsCanvas";
import { TableTopComponent, usePortalTableTabs } from "../portal";
import { EntityDataTable } from "./EntityDataTable";
import { Tabs } from "@/components/app/tabs";

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
      {tableTabs.length > 0 ? (
        <Tabs
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
              label: fakeMessageDescriptor(`${title}(${currentCount})`),
            };
          })}
        />
      ) : (
        <EntityDataTable {...{ ...dataTableProps }} />
      )}
      <DetailsCanvas />
    </>
  );
}
