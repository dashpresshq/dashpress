import { useEntitiesFilterCount } from "frontend/hooks/data/data.store";
import { abbreviateNumber } from "@hadmean/protozoa";
import { ITableTab, FieldQueryFilter } from "shared/types/data";
import { useChangeRouterParam, useRouteParam } from "frontend/lib/routing";
import { StyledCard, Tabs, TableSkeleton } from "@hadmean/chromista";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { DetailsCanvas } from "./DetailsCanvas";
import { TableTopComponent, usePortalTableTabs } from "../portal";
import { EntityDataTable } from "./EntityDataTable";

interface IProps {
  entity: string;
  persistFilters?: FieldQueryFilter[];
}

export function WholeEntityTable({ entity, persistFilters = [] }: IProps) {
  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");
  const portalTableTabs = usePortalTableTabs(entity);
  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    entity
  );

  const tableTabs = [...entityViews.data, ...portalTableTabs.data];

  const tableViewsCount = useEntitiesFilterCount(
    tableTabs.length === 0
      ? []
      : tableTabs.map(({ id, dataState }) => ({
          entity,
          id,
          filters: [
            ...(dataState.filters as FieldQueryFilter[]),
            ...persistFilters,
          ],
        }))
  );

  return (
    <>
      <TableTopComponent entity={entity} />
      <StyledCard>
        <ViewStateMachine
          error={entityViews.error || portalTableTabs.error}
          loading={entityViews.isLoading || portalTableTabs.isLoading}
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
                      entity={entity}
                      tabKey={title}
                      persitentFilters={persistFilters}
                      defaultTableState={dataState}
                    />
                  ),
                  label: title.trim(),
                  overrideLabel: `${title}(${currentCount})`,
                };
              })}
            />
          ) : (
            <EntityDataTable
              entity={entity}
              persitentFilters={persistFilters}
            />
          )}
        </ViewStateMachine>
      </StyledCard>
      <DetailsCanvas />
    </>
  );
}
