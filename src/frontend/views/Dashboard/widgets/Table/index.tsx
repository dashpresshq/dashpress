import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { EntityTableView } from "frontend/views/data/Table/TableView";
import { ITableTab } from "shared/types/data";
import { ITableWidgetConfig } from "shared/types/dashboard";
import { IWidgetProps } from "../types";

export function TableWidget({ config }: IWidgetProps<ITableWidgetConfig>) {
  const { queryId, entity } = config;

  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    config.entity
  );
  const dataState = (entityViews.data || []).find(
    ({ id }) => id === queryId
  )?.dataState;

  return (
    <EntityTableView
      entity={entityViews.isLoading ? SLUG_LOADING_VALUE : entity}
      defaultTableState={{ ...dataState, pageSize: 5 }}
      lean
      border
    />
  );
}
