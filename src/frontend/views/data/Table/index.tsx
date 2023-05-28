import {
  useChangeRouterParam,
  useRouteParam,
  useSetPageDetails,
} from "frontend/lib/routing";
import { ITableTab, QueryFilter } from "shared/types/data";
import {
  DEFAULT_TABLE_STATE,
  StyledCard,
  Tabs,
  TableSkeleton,
} from "@hadmean/chromista";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { useEntitiesFilterCount } from "frontend/hooks/data/data.store";
import { abbreviateNumber } from "@hadmean/protozoa";
import { GranularEntityPermissions } from "shared/types/user";
import { AppLayout } from "../../../_layouts/app";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { EntityDataTable } from "./DataTable/EntityDataTable";
import { useTableMenuItems } from "./useTableMenuItems";
import { DetailsCanvas } from "./DetailsCanvas";
import { TableTopComponent } from "./portal";

export function EntityTable() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction(entity);

  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Table,
    EntityActionTypes.Diction,
    EntityActionTypes.Labels,
    EntityActionTypes.Types,
  ]);

  useSetPageDetails({
    pageTitle: entityDiction.plural,
    viewKey: "ENTITY_TABLE",
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
      entity,
      GranularEntityPermissions.Show
    ),
  });

  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    entity
  );

  const menuItems = useTableMenuItems(entity);

  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");

  const firstTabView: ITableTab = entityViews.data?.[0] || {
    id: "",
    title: "",
    dataState: DEFAULT_TABLE_STATE,
  };

  const tableViewsCount = useEntitiesFilterCount(
    entityViews.data.length <= 1
      ? []
      : entityViews.data.map(({ id, dataState }) => ({
          entity,
          id,
          filters: dataState.filters as QueryFilter[],
        }))
  );

  return (
    <AppLayout actionItems={menuItems} secondaryActionItems={actionItems}>
      <TableTopComponent entity={entity} />
      <StyledCard>
        <ViewStateMachine
          error={entityViews.error}
          loading={entityViews.isLoading}
          loader={<TableSkeleton />}
        >
          {entityViews.data.length > 1 ? (
            <Tabs
              padContent={false}
              lazy
              currentTab={tabFromUrl}
              onChange={changeTabParam}
              contents={entityViews.data.map(({ title, dataState, id }) => {
                const currentViewSlice = tableViewsCount.data[id];

                const currentCount = currentViewSlice.isLoading
                  ? "Counting..."
                  : abbreviateNumber(currentViewSlice?.data?.count || 0);

                return {
                  content: (
                    <EntityDataTable
                      entity={entity}
                      tabKey={title}
                      defaultTableState={dataState}
                    />
                  ),
                  label: title,
                  overrideLabel: `${title}(${currentCount})`,
                };
              })}
            />
          ) : (
            <EntityDataTable
              entity={entity}
              defaultTableState={firstTabView.dataState}
            />
          )}
        </ViewStateMachine>
      </StyledCard>
      <DetailsCanvas />
    </AppLayout>
  );
}
