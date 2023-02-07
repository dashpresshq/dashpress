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
import { META_USER_PERMISSIONS } from "shared/types/user";
import { useEntitiesFilterCount } from "frontend/hooks/data/data.store";
import { abbreviateNumber } from "@hadmean/protozoa";
import { AppLayout } from "../../../_layouts/app";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { EntityTableView } from "./TableView";
import { useTableMenuItems } from "./useTableMenuItems";

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
    permission: META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(entity),
  });

  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    entity
  );

  const menuItems = useTableMenuItems(entity);

  const tabFromUrl = useRouteParam("tab");
  const changeTabParam = useChangeRouterParam("tab");

  const firstTabView: ITableTab = (entityViews.data || [])?.[0] || {
    id: "",
    title: "",
    dataState: DEFAULT_TABLE_STATE,
  };

  const tableViewsCount = useEntitiesFilterCount(
    (entityViews.data || []).length <= 1
      ? []
      : entityViews.data.map(({ id, dataState }) => ({
          entity,
          id,
          filters: (dataState.filters as QueryFilter[]) || [],
        }))
  );
  // TODO Sync current tab to state so that we can have it back to state
  return (
    <AppLayout actionItems={menuItems} secondaryActionItems={actionItems}>
      <StyledCard>
        <ViewStateMachine
          error={entityViews.error}
          loading={entityViews.isLoading}
          loader={<TableSkeleton />}
        >
          {(entityViews.data || []).length > 1 ? (
            <Tabs
              padContent={false}
              currentTab={tabFromUrl}
              onChange={changeTabParam}
              contents={(entityViews.data || []).map(
                ({ title, dataState, id }) => {
                  const currentViewSlice = tableViewsCount.data[id];

                  const currentCount = currentViewSlice.isLoading
                    ? "Counting..."
                    : abbreviateNumber(currentViewSlice?.data?.count || 0);

                  return {
                    content: (
                      <EntityTableView
                        entity={entity}
                        contextKey={title}
                        defaultTableState={dataState}
                      />
                    ),
                    label: title,
                    overrideLabel: `${title}(${currentCount})`,
                  };
                }
              )}
            />
          ) : (
            <EntityTableView
              entity={entity}
              defaultTableState={firstTabView.dataState}
            />
          )}
        </ViewStateMachine>
      </StyledCard>
    </AppLayout>
  );
}
